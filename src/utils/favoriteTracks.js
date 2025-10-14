  // Your Personal Music Collection - New Structure
  export const ARTISTS_DATA = {
    // Metal Artists
    "Bring Me The Horizon": {
        id: "1Ffb6ejR6Fe5IamqA5oRUF", // Hanya ID saja
      genre: "metal",
      albums: {
          "POST HUMAN: NeX GEn": {
            // corrected album ID (previous value duplicated another album)
            id: "7Cpc5A7zhTKXkUDKnYLRYy", // Album ID
          tracks: [
            '7HKRWMTErKh56EIBeFcmdf', // Lost
            '5QQlmUR2fIfrstMT0TMC97', // DArkSide
          ]
        },
        "Amo": {
          id: "04mkS7FooK8fRbB626T9NR",
          tracks: [
            '3iJxLAi8NQw3e5YGiGVqXj', // Mantra
            '6L89mwZXSOwYl76YXfX13s', // Wonderful Life
          ]
        }
      }
    },

    // Black Metal Artists
    "Dimmu Borgir": {
      id: "6e8ISIsI7UQZPyEorefAhK",
      genre: "black-metal",
      albums: {
        "Death Cult Armageddon": {
          id: "4vH4syekS3nRm3Y3E0yAww",
          tracks: [
            '2eT3MkLxTvUaZiPi0JIND1', // Progenies of the Great Apocalypse
            '5t5Q7p0G9QBo2iDp0lR0d9', // Vredesbyrd
          ]
        }
      }
    },

    // Rock Artists
    "Slipknot": {
      id: "05fG473iIaoy82BF1aGhL8", // ID dari URL Anda
      genre: "metal",
      albums: {
        "We Are Not Your Kind": {
          // corrected album ID for Slipknot
          id: "7aVKCN8M7aYs2s2NQH3p2e",
          tracks: [
            '2GbJ7W88aYYh8GQbsd3wt2', // Unsainted
            '6IskveohQRW7jX5Vy49p4U', // Solway Firth
          ]
        },
        "Iowa": {
          id: "hG1tQ1NfSWKnxCuFSBTmAA",
          tracks: [
            '3f9uWeCG0p28v84DqPwtQU', // Left Behind
            '0Q7a3K1M7LjjKZZ2cO8wFD', // My Plague
          ]
        }
      }
    }
  };

  // Helper functions
  export const getArtistsByGenre = (genre) => {
    return Object.entries(ARTISTS_DATA)
      .filter(([_, data]) => data.genre === genre)
      .reduce((acc, [name, data]) => {
        acc[name] = data;
        return acc;
      }, {});
  };

  export const getAllArtists = () => {
    return ARTISTS_DATA;
  };

  export const getArtistAlbums = (artistName) => {
    return ARTISTS_DATA[artistName]?.albums || {};
  };

  export const getAlbumTracks = (artistName, albumName) => {
    return ARTISTS_DATA[artistName]?.albums[albumName]?.tracks || [];
  };

  // Robust ID extraction from Spotify URLs or URIs
  // Handles forms like:
  //  - https://open.spotify.com/track/{id}
  //  - https://open.spotify.com/track/{id}?si=...
  //  - spotify:track:{id}
  const idFromUrl = (url, type) => {
    if (!url) return null;
    // spotify:track:ID
    const colonPattern = new RegExp(`spotify:${type}:([^/?#]+)`);
    const colonMatch = url.match(colonPattern);
    if (colonMatch) return colonMatch[1];

    // https://open.spotify.com/type/ID (stop at ?, # or /)
    const slashPattern = new RegExp(`${type}\/([^\/?#]+)`);
    const slashMatch = url.match(slashPattern);
    if (slashMatch) return slashMatch[1];

    return null;
  };

  export const extractArtistIdFromUrl = (url) => idFromUrl(url, 'artist');
  export const extractAlbumIdFromUrl = (url) => idFromUrl(url, 'album');
  export const extractTrackIdFromUrl = (url) => idFromUrl(url, 'track');

  // Lookup helpers by ID
  export const getArtistById = (id) => {
    return Object.entries(ARTISTS_DATA).find(([, data]) => data.id === id)?.[1] || null;
  };

  export const getAlbumById = (id) => {
    for (const [, artistData] of Object.entries(ARTISTS_DATA)) {
      if (!artistData.albums) continue;
      for (const [albumName, albumData] of Object.entries(artistData.albums)) {
        if (albumData.id === id) {
          return { artistName: Object.keys(ARTISTS_DATA).find(name => ARTISTS_DATA[name] === artistData), albumName, albumData };
        }
      }
    }
    return null;
  };

  export const getTrackById = (id) => {
    for (const [artistName, artistData] of Object.entries(ARTISTS_DATA)) {
      if (!artistData.albums) continue;
      for (const [albumName, albumData] of Object.entries(artistData.albums)) {
        if (Array.isArray(albumData.tracks) && albumData.tracks.includes(id)) {
          return { artistName, albumName, albumData, trackId: id };
        }
      }
    }
    return null;
  };