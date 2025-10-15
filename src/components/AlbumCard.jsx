import { useState, useEffect } from 'react';
import { getAlbum } from '../services/spotifyApi';

const AlbumCard = ({ albumName, albumData, artistName, onSelectAlbum }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [albumImage, setAlbumImage] = useState(null);
  
  // Fetch album image when component mounts
  useEffect(() => {
    let cancelled = false;

    const fetchAlbumImage = async () => {
      // Prefer already-provided spotifyData image
      if (albumData.spotifyData?.images?.[0]?.url) {
        setAlbumImage(albumData.spotifyData.images[0].url);
        return;
      }

      // Next prefer a static image field if present
      if (albumData.image) {
        setAlbumImage(albumData.image);
        return;
      }

      // If no image available, try fetching album info from Spotify
      if (albumData.id) {
        try {
          const spotifyAlbum = await getAlbum(albumData.id);
          if (!cancelled && spotifyAlbum?.images?.[0]?.url) {
            setAlbumImage(spotifyAlbum.images[0].url);
          }
        } catch (err) {
          // fail silently and keep placeholder
          // console.debug('AlbumCard: failed to fetch album image', err);
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
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/50 p-4 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex flex-col space-y-3">
        {/* Album Art */}
        <div className="relative">
          {albumImage && !imageError ? (
            <>
              <img
                src={albumImage}
                alt={albumName}
                className={`w-full aspect-square rounded-xl object-cover ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-700 rounded-xl animate-pulse"></div>
              )}
            </>
          ) : (
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl text-center px-2">
                {albumName.split(' ').map(word => word.charAt(0)).join('').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Album Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-lg mb-1">
            {albumName}
          </h3>
          <p className="text-blue-300 text-sm truncate mb-2">
            {artistName}
          </p>
          <p className="text-slate-400 text-xs">
            {albumData.tracks?.length || 0} tracks
          </p>
        </div>

        {/* View Button */}
        <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all">
          View Tracks
        </button>
      </div>
    </div>
  );
};

export default AlbumCard;