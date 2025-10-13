  // Your Personal Music Collection - New Structure
  export const ARTISTS_DATA = {
    // Metal Artists
    "Bring Me The Horizon": {
      id: "1Ffb6ejR6Fe5IamqA5oRUF", // Hanya ID saja
      genre: "metal",
      albums: {
        "POST HUMAN: NeX GEn": {
          id: "5lOFvOWAdy9G6p44noRILU", // Album ID
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
          id: "5lOFvOWAdy9G6p44noRILU",
          tracks: [
            '2yTnWN1R5j6grXC8YLf5mc', // Unsainted
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

  // Extract Artist ID from Spotify URL
  export const extractArtistIdFromUrl = (url) => {
    const match = url.match(/artist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Extract Album ID from Spotify URL
  export const extractAlbumIdFromUrl = (url) => {
    const match = url.match(/album\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Extract Track ID from Spotify URL
  export const extractTrackIdFromUrl = (url) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };