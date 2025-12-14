import { useState, useEffect } from 'react';

const ArtistCard = ({ artistName, artistData, isSelected, onSelectArtist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [artistImage, setArtistImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch artist image when component mounts
  useEffect(() => {
    const fetchArtistImage = async () => {
      if (artistData.spotifyData?.images?.[0]?.url) {
        setArtistImage(artistData.spotifyData.images[0].url);
      } else if (artistData.image) {
        setArtistImage(artistData.image);
      }
    };

    fetchArtistImage();
  }, [artistData]);

  const handleClick = () => {
    onSelectArtist(artistName, artistData);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getGenreIcon = (genre) => {
    switch (genre) {
      case 'metal': return 'ri-fire-line';
      case 'black-metal': return 'ri-skull-line';
      case 'rock': return 'ri-guitar-line';
      default: return 'ri-music-line';
    }
  };

  const getGenreColor = (genre) => {
    switch (genre) {
      case 'metal': return 'from-red-500 to-orange-500';
      case 'black-metal': return 'from-gray-800 to-black';
      case 'rock': return 'from-yellow-500 to-red-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 cursor-pointer group"
    >
      {/* Modern Card Container - Fixed Height */}
      <div className="relative artist-card-container p-6 glass rounded-3xl hover-lift transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/20 flex flex-col">
        
        {/* Artist Image - Fixed Position */}
        <div className="relative w-32 h-32 mx-auto mb-4 flex-shrink-0">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGenreColor(artistData.genre)} opacity-20 blur-xl transition-all duration-500 ${isHovered ? 'scale-110 opacity-40' : ''}`}></div>
          
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-all duration-300">
            {artistImage && !imageError ? (
              <>
                <img
                  src={artistImage}
                  alt={artistName}
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
              <div className={`w-full h-full bg-gradient-to-br ${getGenreColor(artistData.genre)} flex items-center justify-center`}>
                <span className="text-white font-bold text-3xl">
                  {artistName.charAt(0)}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <i className="ri-play-line text-white text-xl"></i>
              </div>
            </div>
          </div>

          {/* Genre Badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <i className={`${getGenreIcon(artistData.genre)} text-white text-sm`}></i>
          </div>
        </div>

        {/* Artist Info - Flexible Height with Proper Text Handling */}
        <div className="text-center flex-grow flex flex-col justify-between">
          <div>
            {/* Artist Name - Allow Multiple Lines */}
            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors px-2 text-ellipsis-2">
              {artistName}
            </h3>
            
            {/* Genre */}
            {artistData.genre && (
              <p className="text-gray-400 text-sm capitalize mb-3">
                {artistData.genre.replace('-', ' ')}
              </p>
            )}
          </div>

          {/* Stats - Always at Bottom */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-auto">
            <span className="flex items-center gap-1">
              <i className="ri-album-line"></i>
              {artistData.albumCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-music-line"></i>
              {artistData.trackCount || 0}
            </span>
          </div>
        </div>

        {/* Action Button - Fixed Position */}
        <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectArtist(artistName, artistData);
            }}
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <i className="ri-arrow-right-line text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;