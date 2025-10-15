import { Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const SongRow = ({ 
  track, 
  isFavorite = false, 
  onToggleFavorite, 
  onPlay 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(track);
  };

  const handlePlayClick = () => {
    onPlay?.(track);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div 
      className="flex items-center py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      {/* Album Art - Small Square */}
      <div className="relative w-12 h-12 mr-3 flex-shrink-0">
        <img
          src={track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url}
          alt={track.album.name}
          className={`w-full h-full rounded-md object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-700 rounded-md animate-pulse"></div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">
          {track.name}
        </h3>
        <p className="text-slate-400 text-sm truncate">
          {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
        </p>
      </div>

      {/* Duration */}
      <span className="text-slate-400 text-sm w-12 text-right mr-2">
        {formatDuration(track.duration_ms)}
      </span>

      {/* Action Buttons (muncul saat hover) */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full ${
            isFavorite
              ? 'text-red-500 hover:bg-red-500/20'
              : 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
          } transition-colors`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-full transition-colors"
          title="Open in Spotify"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default SongRow;