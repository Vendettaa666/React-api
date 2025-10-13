import { useEffect } from 'react';
import { X } from 'lucide-react';
import SongCard from './SongCard';

const TrackModal = ({ 
  isOpen, 
  onClose, 
  artistName, 
  albumName, 
  tracks, 
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleFavorite 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-slate-900 rounded-2xl border border-slate-600/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{albumName}</h2>
            <p className="text-purple-300">{artistName}</p>
            <p className="text-slate-400 text-sm mt-1">
              {tracks.length} tracks
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tracks Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track, index) => (
              <SongCard
                key={track.id || index}
                track={track}
                onToggleFavorite={onToggleFavorite}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                onPlay={onPlayTrack}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackModal;