// Utility untuk manage favorite tracks
export const FAVORITE_TRACKS = {
  // Lagu Indonesia
  INDONESIA: [
    { id: '1n9tGzYLAgqxVq9Y8tGTUQ', name: 'Sial - Mahalini' },
    { id: '5QQlmUR2fIfrstMT0TMC97', name: 'Jiwa Yang Bersedih - Ghea Indrawari' },
    { id: '3p2DpHcXp0dQ9gJz1OjQbT', name: 'Hati-Hati di Jalan - Tulus' },
    { id: '7g13jfSURGQir99A5FgbJm', name: 'Sempurna - Andra and The BackBone' },
    { id: '4kF3pcfjLYA6e4kpPbWmSW', name: 'Bertaut - Nadin Amizah' }
  ],
  
  // Lagu International
  INTERNATIONAL: [
    { id: '4cOdK2wGLETKBW3PvgPWqT', name: 'Blinding Lights - The Weeknd' },
    { id: '0VjIjW4GlUZAMYd2vXMi3b', name: 'As It Was - Harry Styles' },
    { id: '7xGfFoTpQ2E7fRF5lN10tr', name: 'Flowers - Miley Cyrus' },
    { id: '3ZCTVFBt2Brf31RLEnCkWJ', name: 'Something Just Like This - Chainsmokers' },
    { id: '5knuzwU65gJK7IF5yJsuaW', name: 'Diamonds - Rihanna' }
  ],
  
  // Lagu Favorite Pribadi (Ganti dengan lagu Anda)
  MY_FAVORITES: [
    { id: 'YOUR_FAVORITE_TRACK_ID_1', name: 'Nama Lagu 1 - Artist' },
    { id: 'YOUR_FAVORITE_TRACK_ID_2', name: 'Nama Lagu 2 - Artist' },
    { id: 'YOUR_FAVORITE_TRACK_ID_3', name: 'Nama Lagu 3 - Artist' }
  ]
};

// Get hanya ID-nya saja
export const getDefaultFavoriteIds = (category = 'ALL') => {
  if (category === 'ALL') {
    return [
      ...FAVORITE_TRACKS.INDONESIA.map(track => track.id),
      ...FAVORITE_TRACKS.INTERNATIONAL.map(track => track.id),
      ...FAVORITE_TRACKS.MY_FAVORITES.map(track => track.id)
    ];
  }
  return FAVORITE_TRACKS[category]?.map(track => track.id) || [];
};