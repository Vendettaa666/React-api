import { useState, useEffect } from 'react';
import { getAlbum } from '../services/spotifyApi';

const AlbumCard = ({ albumName, albumData, artistName, onSelectAlbum }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [albumImage, setAlbumImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAlbumImage = async () => {
      if (albumData.spotifyData?.images?.[0]?.url) {
        setAlbumImage(albumData.spotifyData.images[0].url);
        return;
      }

      if (albumData.image) {
        setAlbumImage(albumData.image);
        return;
      }

      if (albumData.id) {
        try {
          const spotifyAlbum = await getAlbum(albumData.id);
          if (!cancelled && spotifyAlbum?.images?.[0]?.url) {
            setAlbumImage(spotifyAlbum.images[0].url);
          }
        } catch (err) {
          // silent fail
        }
      }
    };

    fetchAlbumImage();

    return () => {
      cancelled = true;
    };
  }, [albumData]);

  const handleClick = () => {
    onSelectAlbum(artistName, albumName, albumData);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass rounded-2xl p-6 hover-lift cursor-pointer group transition-all duration-500 album-card-container flex flex-col"
    >
      {/* Album Art - Fixed Size */}
      <div className="relative mb-4 flex-shrink-0">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl">
          {albumImage && !imageError ? (
            <>
              <img
                src={albumImage}
                alt={albumName}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                } ${isHovered ? 'scale-110' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse"></div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {albumName.split(' ').map(w => w.charAt(0)).join('').toUpperCase()}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="ri-play-line text-white text-2xl"></i>
            </div>
          </div>

          {/* Track Count Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
            {albumData.tracks?.length || 0} tracks
          </div>
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl transition-all duration-500 ${
          isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
        }`}></div>
      </div>

      {/* Album Info - Flexible Height */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          {/* Album Name - Allow Multiple Lines */}
          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors text-ellipsis-2">
            {albumName}
          </h3>
          
          {/* Artist Name */}
          <p className="text-gray-400 text-sm mb-1 text-ellipsis-1">
            by {artistName}
          </p>
          
          {/* Release Year */}
          {albumData.releaseDate && (
            <p className="text-gray-500 text-xs">
              {new Date(albumData.releaseDate).getFullYear()}
            </p>
          )}
        </div>

        {/* Action Button - Always at Bottom */}
        <div className={`mt-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <i className="ri-headphone-line"></i>
            Listen Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;