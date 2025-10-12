// Your Personal Music Collection
// Edit this array to add your favorite songs!
export const MY_FAVORITE_TRACKS = [
  // ADD YOUR FAVORITE SONGS HERE
  // Format: { id: 'SPOTIFY_TRACK_ID', name: 'Song Title - Artist Name' }
  
  // Example songs (uncomment and modify as needed):
  // { id: '4cOdK2wGLETKBW3PvgPWqT', name: 'Blinding Lights - The Weeknd' },
  // { id: '0VjIjW4GlUZAMYd2vXMi3b', name: 'As It Was - Harry Styles' },
  // { id: '7xGfFoTpQ2E7fRF5lN10tr', name: 'Flowers - Miley Cyrus' },
  { id: '7HKRWMTErKh56EIBeFcmdf', name: 'Sial - Mahalini' },
  { id: '5QQlmUR2fIfrstMT0TMC97', name: 'Jiwa Yang Bersedih - Ghea Indrawari' },
  
  // Your songs go here:
];

// Simple function to get your favorite track IDs
export const getDefaultFavoriteIds = () => {
  return MY_FAVORITE_TRACKS.map(track => track.id);
};