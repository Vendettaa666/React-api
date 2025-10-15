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
      className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'scale-105'
          : 'hover:scale-105 hover:opacity-90'
      }`}
    >
      {/* Circle Image */}
      <div
        className={`relative w-48 h-48 rounded-full overflow-hidden border-2 transition-all duration-300 ${
          isSelected
            ? 'border-blue-500 ring-2 ring-blue-400/50'
            : 'border-slate-600/50 hover:border-blue-500/50'
        }`}
      >
        {artistImage && !imageError ? (
          <>
            <img
              src={artistImage}
              alt={artistName}
              className={`w-full h-full object-cover ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {artistName.charAt(0)}
            </span>
          </div>
        )}

        {/* View Button - Small Icon in Corner */}
        <button
          className={`absolute bottom-2 right-2 p-1.5 rounded-full text-xs font-medium transition-all ${
            isSelected
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectArtist(artistName, artistData);
          }}
        >
          {isSelected ? '✕' : '+'}
        </button>
      </div>

      {/* Artist Name Below Circle */}
      <h3 className="mt-3 font-semibold text-white text-lg truncate max-w-[12rem] text-center">
        {artistName}
      </h3>

      {/* Optional: Genre or Album Count */}
      {artistData.genre && (
        <p className="text-purple-300 text-sm mt-1 capitalize">
          {artistData.genre.replace('-', ' ')}
        </p>
      )}
    </div>
  );
};

export default ArtistCard;