// src/components/AlbumCard.js

import { useState, useEffect } from 'react';
import { getAlbum } from '../services/spotifyApi';

const AlbumCard = ({ albumName, albumData, artistName, onSelectAlbum }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [albumImage, setAlbumImage] = useState(null);

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
      className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 hover:border-blue-500/40 hover:transform hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="flex flex-col items-center space-y-2">
        {/* Album Art - Diperkecil */}
        <div className="relative w-45 h-45 rounded-md overflow-hidden">
          {albumImage && !imageError ? (
            <>
              <img
                src={albumImage}
                alt={albumName}
                className={`w-full h-full object-cover ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-200`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {albumName.split(' ').map(w => w.charAt(0)).join('').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Album Info */}
        <div className="text-center">
          <h3 className="font-medium text-white truncate text-xs max-w-[9rem]">
            {albumName}
          </h3>
          <p className="text-blue-300 text-[10px] truncate">
            {artistName}
          </p>
          <p className="text-slate-400 text-[10px]">
            {albumData.tracks?.length || 0} tracks
          </p>
        </div>

        {/* View Button */}
        <button className="w-full py-1 text-[10px] font-medium rounded bg-blue-600/80 text-white hover:bg-blue-500 transition-colors">
          View
        </button>
      </div>
    </div>
  );
};

export default AlbumCard;