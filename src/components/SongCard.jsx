import { Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const SongCard = ({ 
  track, 
  isFavorite = false, 
  onToggleFavorite, 
  isPlaying = false,
  onPlay 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePlayClick = () => {
    onPlay?.(track);
  };

  const handleFavoriteClick = () => {
    onToggleFavorite?.(track);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/50 p-4 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-500/50 hover:transform hover:-translate-y-1">
      <div className="flex flex-col space-y-3">
        {/* Album Art with Play Button */}
        <div className="relative">
          <img
            src={track.album.images[1]?.url || track.album.images[0]?.url}
            alt={track.album.name}
            className={`w-full aspect-square rounded-xl object-cover ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-700 rounded-xl animate-pulse"></div>
          )}
          
          {/* Play Button Overlay */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl opacity-0 hover:opacity-100 transition-all duration-300"
          >
            {isPlaying ? (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full shadow-2xl">
                <i className="ri-pause-fill ri-2x text-white"></i>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full shadow-2xl">
                <i className="ri-play-fill ri-2x text-white"></i>
              </div>
            )}
          </button>

          {/* Preview Indicator */}
          {track.preview_url && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded-full backdrop-blur-sm">
              Preview
            </span>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-lg mb-1">
            {track.name}
          </h3>
          <p className="text-purple-300 text-sm truncate mb-2">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-slate-400 text-xs truncate mb-3">
            {track.album.name} • {formatDuration(track.duration_ms)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleFavoriteClick}
            className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
              isFavorite 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? 'currentColor' : 'none'} 
            />
          </button>
          
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 hover:text-white transform hover:scale-110 transition-all"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SongCard;