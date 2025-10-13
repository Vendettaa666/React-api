import { useState, useEffect } from "react";
import { getMultipleTracks, getArtist, getAlbum, getMultipleArtists } from './services/spotifyApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { getAllArtists, getArtistsByGenre, getArtistAlbums, getAlbumTracks } from './utils/favoriteTracks';
import ArtistCard from './components/ArtistCard';
import AlbumCard from './components/AlbumCard';
import TrackModal from './components/TrackModal';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [favorites, setFavorites] = useLocalStorage('spotify-favorites', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State untuk navigasi
  const [currentView, setCurrentView] = useState('artists');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [modalTracks, setModalTracks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk data yang difetch dari Spotify
  const [artistsWithData, setArtistsWithData] = useState({});

  const {
    currentTrack,
    isPlaying,
    progress,
    audioRef,
    playTrack,
    stopTrack
  } = useAudioPlayer();

  // Fetch all artist data from Spotify on component mount
  useEffect(() => {
    const fetchArtistsData = async () => {
      setIsLoading(true);
      try {
        const allArtists = getAllArtists();
        const artistIds = Object.values(allArtists).map(artist => artist.id);
        
        // Fetch all artists data from Spotify
        const spotifyArtists = await getMultipleArtists(artistIds);
        
        // Combine our local data with Spotify data
        const combinedArtistsData = {};
        
        Object.entries(allArtists).forEach(([artistName, localData], index) => {
          const spotifyData = spotifyArtists[index];
          combinedArtistsData[artistName] = {
            ...localData,
            spotifyData: spotifyData
          };
        });

        setArtistsWithData(combinedArtistsData);
      } catch (err) {
        console.error('Error fetching artists data:', err);
        setError('Failed to load artists data');
        // Fallback to local data
        setArtistsWithData(getAllArtists());
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistsData();
  }, []);

  const getArtistsByGenreWithData = (genre) => {
    return Object.entries(artistsWithData)
      .filter(([_, data]) => data.genre === genre)
      .reduce((acc, [name, data]) => {
        acc[name] = data;
        return acc;
      }, {});
  };

  const handleSelectArtist = (artistName, artistData) => {
    setSelectedArtist({ name: artistName, data: artistData });
    setCurrentView('albums');
  };

  const handleBackToArtists = () => {
    setCurrentView('artists');
    setSelectedArtist(null);
  };

  const handleSelectAlbum = async (artistName, albumName, albumData) => {
    setIsLoading(true);
    try {
      // Fetch album data from Spotify if not already available
      let albumWithData = albumData;
      if (!albumData.spotifyData) {
        try {
          const spotifyAlbum = await getAlbum(albumData.id);
          albumWithData = {
            ...albumData,
            spotifyData: spotifyAlbum
          };
        } catch (error) {
          console.error('Error fetching album data:', error);
        }
      }

      const trackIds = albumData.tracks;
      const tracks = await getMultipleTracks(trackIds);
      const validTracks = tracks.filter(track => track !== null);
      
      setModalTracks(validTracks);
      setSelectedAlbum({ 
        name: albumName, 
        artist: artistName, 
        data: albumWithData 
      });
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load tracks: ' + err.message);
      console.error('Error loading tracks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (track) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.id === track.id);
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== track.id));
      if (currentTrack?.id === track.id) {
        stopTrack();
      }
    } else {
      setFavorites(prev => [...prev, track]);
    }
  };

  const handlePlayTrack = (track) => {
    if (!track.preview_url) {
      alert('No preview available for this track');
      return;
    }
    playTrack(track);
  };

  // Close the track modal and clear selected album/tracks
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
    setModalTracks([]);
  };

  const renderArtistsSection = (artists, genre, title) => (
    <section id={`${genre}-section`} className="py-16 px-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-300">Explore your favorite {title.toLowerCase()}</p>
        </div>

        {Object.keys(artists).length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(artists).map(([artistName, artistData]) => (
              <ArtistCard
                key={artistName}
                artistName={artistName}
                artistData={artistData}
                onSelectArtist={handleSelectArtist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            No artists found for this genre.
          </div>
        )}
      </div>
    </section>
  );

  const renderAlbumsView = () => {
    if (!selectedArtist) return null;

    const albums = getArtistAlbums(selectedArtist.name);

    return (
      <section className="py-16 px-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={handleBackToArtists}
              className="mb-4 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <i className="ri-arrow-left-line"></i>
              Back to Artists
            </button>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedArtist.name}</h2>
            <p className="text-slate-300">Albums Collection</p>
          </div>

          {/* Albums Grid */}
          {Object.keys(albums).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Object.entries(albums).map(([albumName, albumData]) => (
                <AlbumCard
                  key={albumName}
                  albumName={albumName}
                  albumData={albumData}
                  artistName={selectedArtist.name}
                  onSelectAlbum={handleSelectAlbum}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">
              No albums found for this artist.
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Hero Section */}
      <section
        id="hero"
        className="hero min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        aria-label="Hero Section"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/31/0d/46/310d46c63db719604362e80d76ed9afd.jpg')",
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600/20 to-indigo-500/20 px-6 py-3 rounded-full mb-6 border border-purple-500/30 backdrop-blur-sm">
              <span className="text-purple-400 font-semibold text-lg">
                My Spotify Music Space
              </span>
            </div>

            <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              WELCOME TO <br />
              <span className="block">My Music Dimension</span>
            </h1>
          </div>

          {/* Social Media */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <a
              href="https://instagram.com/leoosatriaa"
              className="text-slate-300 hover:text-pink-400 transition-colors transform hover:scale-110"
              aria-label="Instagram"
            >
              <i className="ri-instagram-line ri-2x"></i>
            </a>
            <a
              href="https://tiktok.com/@vendettaa.666"
              className="text-slate-300 hover:text-black transition-colors transform hover:scale-110"
              aria-label="TikTok"
            >
              <i className="ri-tiktok-line ri-2x"></i>
            </a>
            <a
              href="https://discord.com/users/770242596945395712"
              className="text-slate-300 hover:text-indigo-400 transition-colors transform hover:scale-110"
              aria-label="Discord"
            >
              <i className="ri-discord-line ri-2x"></i>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => document.getElementById('metal-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-300 hover:text-white"
          >
            <i className="ri-arrow-down-s-line ri-2x"></i>
          </button>
        </div>
      </section>

      {/* Now Playing Bar - Global */}
      {currentTrack && (
        <div className="sticky top-0 z-40 bg-slate-800/70 backdrop-blur-sm p-4 border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentTrack.album.images[2]?.url}
                alt={currentTrack.name}
                className="w-14 h-14 rounded-lg shadow-lg"
              />
              <div className="text-left">
                <p className="font-semibold text-white text-lg">{currentTrack.name}</p>
                <p className="text-sm text-purple-300">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => playTrack(currentTrack)}
                className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/30"
              >
                {isPlaying ? (
                  <i className="ri-pause-line ri-lg"></i>
                ) : (
                  <i className="ri-play-line ri-lg"></i>
                )}
              </button>
              <div className="w-24 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="sticky top-20 z-30 p-4 bg-red-500/20 border border-red-400/50 text-red-200 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            {error}
          </div>
        </div>
      )}

      {/* Loading untuk initial data */}
      {isLoading && Object.keys(artistsWithData).length === 0 ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        /* Main Content */
        currentView === 'artists' ? (
          <>
            {renderArtistsSection(getArtistsByGenreWithData('metal'), 'metal', 'Metal Artists')}
            {renderArtistsSection(getArtistsByGenreWithData('black-metal'), 'black-metal', 'Black Metal Artists')}
            {renderArtistsSection(getArtistsByGenreWithData('rock'), 'rock', 'Rock Artists')}
          </>
        ) : (
          renderAlbumsView()
        )
      )}

      {/* Track Modal */}
      <TrackModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        artistName={selectedAlbum?.artist}
        albumName={selectedAlbum?.name}
        tracks={modalTracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayTrack={handlePlayTrack}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}

export default App;