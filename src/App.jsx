import { useState, useEffect, useRef } from "react";
import { getMultipleTracks, getArtist, getAlbum, getMultipleArtists } from './services/spotifyApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { getAllArtists, getArtistsByGenre, getArtistAlbums, getAlbumTracks } from './utils/favoriteTracks';
import ArtistCard from './components/ArtistCard';
import AlbumCard from './components/AlbumCard';
import TrackModal from './components/TrackModal';
import LoadingSpinner from './components/LoadingSpinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/effect-coverflow';

function App() {
  const [favorites, setFavorites] = useLocalStorage('spotify-favorites', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Enhanced navigation states
  const [currentView, setCurrentView] = useState('home');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [modalTracks, setModalTracks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('all');
  
  // Data states
  const [artistsWithData, setArtistsWithData] = useState({});
  const [featuredTracks, setFeaturedTracks] = useState([]);
  
  // UI states
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Refs
  const heroRef = useRef(null);
  const exploreRef = useRef(null);

  const {
    currentTrack,
    isPlaying,
    progress,
    audioRef,
    playTrack,
    stopTrack
  } = useAudioPlayer();

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        
        // Set featured tracks from first few albums
        const featured = [];
        Object.values(combinedArtistsData).slice(0, 3).forEach(artist => {
          const albums = getArtistAlbums(Object.keys(combinedArtistsData).find(key => combinedArtistsData[key] === artist));
          if (albums && Object.keys(albums).length > 0) {
            const firstAlbum = Object.values(albums)[0];
            if (firstAlbum.tracks && firstAlbum.tracks.length > 0) {
              featured.push(...firstAlbum.tracks.slice(0, 2));
            }
          }
        });
        setFeaturedTracks(featured);
        
      } catch (err) {
        console.error('Error fetching artists data:', err);
        setError('Failed to load artists data');
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

  // Modern Navigation Component
  const ModernNavbar = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <i className="ri-music-2-line text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold gradient-text-purple">SoulBeats</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'home' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('explore')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'explore' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Explore
            </button>
            <button 
              onClick={() => setCurrentView('favorites')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'favorites' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg glass"
          >
            <i className={`ri-${showMobileMenu ? 'close' : 'menu'}-line text-white text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 glass-dark rounded-xl">
            <div className="px-4 py-2 space-y-2">
              <button 
                onClick={() => { setCurrentView('home'); setShowMobileMenu(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
              >
                Home
              </button>
              <button 
                onClick={() => { setCurrentView('explore'); setShowMobileMenu(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
              >
                Explore
              </button>
              <button 
                onClick={() => { setCurrentView('favorites'); setShowMobileMenu(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
              >
                Favorites ({favorites.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  // Modern Hero Section
  const ModernHero = () => (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-xl float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="space-y-8">
          {/* Main Title with Animation */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text-purple">Feel the</span>
              <br />
              <span className="text-white">Soul of Music</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover extraordinary artists, explore diverse genres, and immerse yourself in the ultimate music experience
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover-lift pulse-glow flex items-center gap-3"
            >
              <i className="ri-play-circle-line text-2xl"></i>
              Start Exploring
            </button>
            <button 
              onClick={() => setCurrentView('favorites')}
              className="px-8 py-4 glass border border-white/20 text-white rounded-2xl font-semibold hover-lift flex items-center gap-3"
            >
              <i className="ri-heart-line text-xl"></i>
              My Favorites ({favorites.length})
            </button>
          </div>

          {/* Music Wave Indicator */}
          {currentTrack && isPlaying && (
            <div className="flex justify-center mt-8">
              <div className="music-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="p-3 glass rounded-full hover:bg-white/10 transition-all"
        >
          <i className="ri-arrow-down-line text-white text-xl"></i>
        </button>
      </div>
    </section>
  );

  // Enhanced Artists Section
  const renderArtistsSection = (artists, genre, title) => (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300">Discover amazing {title.toLowerCase()}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {Object.keys(artists).length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, FreeMode, Autoplay]}
              spaceBetween={24}
              slidesPerView={'auto'}
              freeMode={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: `.swiper-button-next-${genre}`,
                prevEl: `.swiper-button-prev-${genre}`,
              }}
              className="!px-12"
            >
              {Object.entries(artists).map(([artistName, artistData]) => (
                <SwiperSlide key={artistName} style={{ width: 'auto' }}>
                  <ArtistCard
                    artistName={artistName}
                    artistData={artistData}
                    onSelectArtist={handleSelectArtist}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Enhanced Navigation Buttons */}
            <button className={`swiper-button-prev-${genre} absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10 hover:border-purple-500/50`}>
              <i className="ri-arrow-left-s-line text-xl"></i>
            </button>
            <button className={`swiper-button-next-${genre} absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10 hover:border-purple-500/50`}>
              <i className="ri-arrow-right-s-line text-xl"></i>
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <i className="ri-music-line text-6xl mb-4 opacity-50"></i>
            <p className="text-xl">No artists found for this genre</p>
          </div>
        )}
      </div>
    </section>
  );

  const renderAlbumsView = () => {
    if (!selectedArtist) return null;

    const albums = getArtistAlbums(selectedArtist.name);

    return (
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <button
              onClick={handleBackToArtists}
              className="mb-6 px-6 py-3 glass rounded-2xl text-purple-400 hover:text-purple-300 transition-all flex items-center justify-center gap-3 mx-auto hover-lift"
            >
              <i className="ri-arrow-left-line text-xl"></i>
              Back to Explore
            </button>
            
            {/* Artist Info */}
            <div className="mb-8">
              {selectedArtist.data.spotifyData?.images?.[0] && (
                <img
                  src={selectedArtist.data.spotifyData.images[0].url}
                  alt={selectedArtist.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-2xl"
                />
              )}
              <h2 className="text-5xl font-bold gradient-text-purple mb-4">{selectedArtist.name}</h2>
              <p className="text-xl text-gray-300 mb-2">Albums Collection</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <i className="ri-album-line"></i>
                  {Object.keys(albums).length} Albums
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-music-line"></i>
                  {selectedArtist.data.genre}
                </span>
              </div>
            </div>
            
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Albums Grid */}
          {Object.keys(albums).length > 0 ? (
            <div className="album-grid">
              {Object.entries(albums).map(([albumName, albumData]) => (
                <div key={albumName} className="group">
                  <AlbumCard
                    albumName={albumName}
                    albumData={albumData}
                    artistName={selectedArtist.name}
                    onSelectAlbum={handleSelectAlbum}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <i className="ri-album-line text-6xl text-gray-400 mb-4 opacity-50"></i>
              <h3 className="text-2xl text-white mb-2">No albums found</h3>
              <p className="text-gray-400">This artist doesn't have any albums in our collection yet.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Genre Filter Component
  const GenreFilter = () => {
    const genres = [
      { id: 'all', name: 'All Genres', icon: 'ri-music-line' },
      { id: 'metal', name: 'Metal', icon: 'ri-fire-line' },
      { id: 'black-metal', name: 'Black Metal', icon: 'ri-skull-line' },
      { id: 'rock', name: 'Rock', icon: 'ri-guitar-line' }
    ];

    return (
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => setActiveGenre(genre.id)}
            className={`px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${
              activeGenre === genre.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                : 'glass text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className={`${genre.icon} text-lg`}></i>
            {genre.name}
          </button>
        ))}
      </div>
    );
  };

  // Favorites View Component
  const FavoritesView = () => (
    <section className="py-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Your Favorites</h2>
          <p className="text-xl text-gray-300">Your personal music collection</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map(track => (
              <div key={track.id} className="glass rounded-2xl p-6 hover-lift">
                <img
                  src={track.album.images[1]?.url}
                  alt={track.name}
                  className="w-full aspect-square rounded-xl mb-4 object-cover"
                />
                <h3 className="text-white font-semibold mb-2 truncate">{track.name}</h3>
                <p className="text-gray-400 text-sm mb-4 truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    <i className={`ri-${currentTrack?.id === track.id && isPlaying ? 'pause' : 'play'}-line text-white`}></i>
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(track)}
                    className="p-3 glass rounded-full hover:bg-red-500/20 transition-all"
                  >
                    <i className="ri-heart-fill text-red-500"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="ri-heart-line text-6xl text-gray-400 mb-4 opacity-50"></i>
            <h3 className="text-2xl text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-8">Start exploring and add some tracks to your favorites!</p>
            <button
              onClick={() => setCurrentView('explore')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover-lift"
            >
              Explore Music
            </button>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Modern Navigation */}
      <ModernNavbar />

      {/* Enhanced Now Playing Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentTrack.album.images[2]?.url}
                alt={currentTrack.name}
                className="w-16 h-16 rounded-xl shadow-lg object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-white text-lg truncate max-w-48">{currentTrack.name}</p>
                <p className="text-sm text-purple-300 truncate max-w-48">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleToggleFavorite(currentTrack)}
                className={`p-2 rounded-full transition-all ${
                  favorites.some(fav => fav.id === currentTrack.id)
                    ? 'text-red-500 hover:bg-red-500/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <i className={`ri-heart-${favorites.some(fav => fav.id === currentTrack.id) ? 'fill' : 'line'} text-xl`}></i>
              </button>
              
              <button
                onClick={() => playTrack(currentTrack)}
                className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all pulse-glow"
              >
                {isPlaying ? (
                  <i className="ri-pause-line text-xl"></i>
                ) : (
                  <i className="ri-play-line text-xl"></i>
                )}
              </button>
              
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-xs text-gray-400">0:00</span>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">0:30</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-4 right-4 z-30 p-4 bg-red-500/20 border border-red-400/50 text-red-200 backdrop-blur-sm rounded-xl">
          <div className="text-center flex items-center justify-center gap-2">
            <i className="ri-error-warning-line"></i>
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === 'home' && (
        <>
          <ModernHero />
          <div ref={exploreRef} className="pt-16">
            <GenreFilter />
            {activeGenre === 'all' ? (
              <>
                {renderArtistsSection(getArtistsByGenreWithData('metal'), 'metal', 'Metal Artists')}
                {renderArtistsSection(getArtistsByGenreWithData('black-metal'), 'black-metal', 'Black Metal Artists')}
                {renderArtistsSection(getArtistsByGenreWithData('rock'), 'rock', 'Rock Artists')}
              </>
            ) : (
              renderArtistsSection(getArtistsByGenreWithData(activeGenre), activeGenre, `${activeGenre.charAt(0).toUpperCase() + activeGenre.slice(1)} Artists`)
            )}
          </div>
        </>
      )}

      {currentView === 'explore' && (
        <div className="pt-20">
          <GenreFilter />
          {activeGenre === 'all' ? (
            <>
              {renderArtistsSection(getArtistsByGenreWithData('metal'), 'metal', 'Metal Artists')}
              {renderArtistsSection(getArtistsByGenreWithData('black-metal'), 'black-metal', 'Black Metal Artists')}
              {renderArtistsSection(getArtistsByGenreWithData('rock'), 'rock', 'Rock Artists')}
            </>
          ) : (
            renderArtistsSection(getArtistsByGenreWithData(activeGenre), activeGenre, `${activeGenre.charAt(0).toUpperCase() + activeGenre.slice(1)} Artists`)
          )}
        </div>
      )}

      {currentView === 'favorites' && <FavoritesView />}

      {currentView === 'albums' && renderAlbumsView()}

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

      {/* Bottom Padding for Now Playing Bar */}
      {currentTrack && <div className="h-24"></div>}
    </div>
  );
}

export default App;