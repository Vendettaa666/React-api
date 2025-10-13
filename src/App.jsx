import { useState, useEffect } from "react";
import { getMultipleTracks } from './services/spotifyApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import SongCard from './components/SongCard';
import LoadingSpinner from './components/LoadingSpinner';
import { getDefaultFavoriteIds } from './utils/favoriteTracks';

const DEFAULT_FAVORITE_IDS = getDefaultFavoriteIds(); 

function App() {
  const [favorites, setFavorites] = useLocalStorage('spotify-favorites', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedDefaults, setHasLoadedDefaults] = useState(false);

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
    if (!hasLoadedDefaults) {
      loadDefaultFavorites();
      setHasLoadedDefaults(true);
    }
  }, [hasLoadedDefaults]);

  const loadDefaultFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tracks = await getMultipleTracks(DEFAULT_FAVORITE_IDS);
      const validTracks = tracks.filter(track => track !== null);
      setFavorites(validTracks);
    } catch (err) {
      setError('Failed to load favorite tracks: ' + err.message);
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (track) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.id === track.id);
    if (isCurrentlyFavorite) {
      // Remove from favorites
      setFavorites(prev => prev.filter(fav => fav.id !== track.id));
      if (currentTrack?.id === track.id) {
        stopTrack();
      }
    }
    // Note: We don't add to favorites here since all displayed songs are already favorites
  };

  const handlePlayTrack = (track) => {
    if (!track.preview_url) {
      alert('No preview available for this track');
      return;
    }
    playTrack(track);
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Hero Section - Only Welcome & Social */}
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

            <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
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
            onClick={() => document.getElementById('music-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-300 hover:text-white"
          >
            <i className="ri-arrow-down-s-line ri-2x"></i>
          </button>
        </div>
      </section>

      <section id="artis-section">

      </section>

      {/* Music Section - All music-related content moved here */}
      <section id="music-section" className="py-16 px-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
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

           {/* Title */}
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-white mb-2">My Favorite Music Collection</h2>
             <p className="text-slate-300">Total: {favorites.length} songs</p>
           </div>


          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl backdrop-blur-sm max-w-2xl mx-auto">
              {error}
            </div>
          )}

           {/* Music Content */}
           <div className="max-w-4xl mx-auto">
             {isLoading ? (
               <LoadingSpinner />
             ) : (
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {favorites.map((track) => (
                   <SongCard
                     key={track.id}
                     track={track}
                     onToggleFavorite={handleToggleFavorite}
                     isPlaying={currentTrack?.id === track.id && isPlaying}
                     onPlay={handlePlayTrack}
                   />
                 ))}
               </div>
             )}

             {/* Empty States */}
             {!isLoading && favorites.length === 0 && (
               <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-600/50">
                 <div className="text-6xl mb-4">🎵</div>
                 <p className="text-slate-300 text-lg mb-4">
                   No favorite songs yet! Add your favorite songs manually in the code.
                 </p>
                 <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 max-w-2xl mx-auto">
                   <h3 className="text-blue-300 font-semibold mb-2">📝 How to add your songs:</h3>
                   <ol className="text-sm text-blue-200 space-y-1 text-left">
                     <li>1. Open <code className="bg-slate-700 px-2 py-1 rounded">src/utils/favoriteTracks.js</code></li>
                     <li>2. Find <code className="bg-slate-700 px-2 py-1 rounded">MY_FAVORITE_TRACK_IDS</code> array</li>
                     <li>3. Add your song IDs in this format:</li>
                     <li className="ml-4"><code className="bg-slate-700 px-2 py-1 rounded">'SPOTIFY_TRACK_ID', // Song - Artist</code></li>
                     
                   </ol>
                 </div>
               </div>
             )}
           </div>
        </div>
      </section>
    </>
  );
}

export default App;