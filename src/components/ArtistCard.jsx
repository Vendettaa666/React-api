import { useState, useEffect } from 'react';

const ArtistCard = ({ artistName, artistData, isSelected, onSelectArtist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [artistImage, setArtistImage] = useState(null);
  
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

  return (
    <div 
      onClick={handleClick}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer ${
        isSelected 
          ? 'border-purple-500 shadow-2xl shadow-purple-500/20 -translate-y-1' 
          : 'border-slate-600/50 hover:border-purple-500/50'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Artist Image */}
        <div className="relative w-32 h-32">
          {artistImage && !imageError ? (
            <>
              <img
                src={artistImage}
                alt={artistName}
                className={`w-full h-full rounded-full object-cover ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-700 rounded-full animate-pulse"></div>
              )}
            </>
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {artistName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-lg mb-2">
            {artistName}
          </h3>
          <p className="text-purple-300 text-sm capitalize">
            {artistData.genre?.replace('-', ' ') || 'Artist'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {Object.keys(artistData.albums || {}).length} albums
          </p>
        </div>

        {/* View Button */}
        <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
        }`}>
          {isSelected ? 'Hide Albums' : 'View Albums'}
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;