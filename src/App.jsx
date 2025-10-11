import { useState, useEffect } from "react";
import { searchTracks, getMultipleTracks } from './services/spotifyApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import SongCard from './components/SongCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import { getDefaultFavoriteIds } from './utils/favoriteTracks';


// Default favorite track IDs - bisa diganti dengan lagu favorit Anda
const DEFAULT_FAVORITE_IDS = getDefaultFavoriteIds('MY_FAVORITES'); 

function App() {
  const [favorites, setFavorites] = useLocalStorage('spotify-favorites', []);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites');
  const [error, setError] = useState(null);

  const {
    currentTrack,
    isPlaying,
    progress,
    audioRef,
    playTrack,
    stopTrack
  } = useAudioPlayer();

  // Load default favorites on first render
  useEffect(() => {
    if (favorites.length === 0) {
      loadDefaultFavorites();
    }
  }, []);

  const loadDefaultFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tracks = await getMultipleTracks(DEFAULT_FAVORITE_IDS);
      setFavorites(tracks.filter(track => track !== null));
    } catch (err) {
      setError('Failed to load favorite tracks');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchLoading(true);
    setError(null);
    try {
      const results = await searchTracks(query, 15);
      setSearchResults(results);
      setActiveTab('search');
    } catch (err) {
      setError('Failed to search tracks');
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
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

  const currentTracks = activeTab === 'favorites' ? favorites : searchResults;

  return (
    <>  
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
      
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
        <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600/20 to-indigo-500/20 px-6 py-3 rounded-full mb-6 border border-purple-500/30 backdrop-blur-sm">
              <span className="text-purple-400 font-semibold text-lg">
                My Spotify Music Space
              </span>
            </div>

            <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 ">
              WELCOME TO <br />
              <span className="block">My Music Dimension</span>
            </h1>

            {/* Now Playing Bar */}
            {currentTrack && (
              <div className="mb-8 bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
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

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-600">
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-3 font-medium text-lg rounded-xl transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  My Favorites ({favorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-6 py-3 font-medium text-lg rounded-xl transition-all ${
                    activeTab === 'search'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  Search Songs
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {activeTab === 'search' && (
              <div className="mb-8 max-w-2xl mx-auto">
                <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl backdrop-blur-sm max-w-2xl mx-auto">
                {error}
              </div>
            )}

            {/* Music Content */}
            <div className="max-w-4xl mx-auto">
              {isLoading || searchLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentTracks.map((track) => (
                    <SongCard
                      key={track.id}
                      track={track}
                      isFavorite={favorites.some(fav => fav.id === track.id)}
                      onToggleFavorite={handleToggleFavorite}
                      isPlaying={currentTrack?.id === track.id && isPlaying}
                      onPlay={handlePlayTrack}
                    />
                  ))}
                </div>
              )}

              {/* Empty States */}
              {!isLoading && !searchLoading && currentTracks.length === 0 && (
                <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-600/50">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-slate-300 text-lg">
                    {activeTab === 'favorites' 
                      ? 'No favorite songs yet. Search for songs to add them!'
                      : 'Search for your favorite songs above!'
                    }
                  </p>
                </div>
              )}
            </div>
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
            onClick={() => document.getElementById('music-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-300 hover:text-white"
          >
            <i className="ri-arrow-down-s-line ri-2x"></i>
          </button>
        </div>
      </section>
    </>
  )
}

export default App