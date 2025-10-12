// Your Personal Music Collection
// Just add Spotify Track IDs here - the app will fetch all details from Spotify!
export const MY_FAVORITE_TRACK_IDS = [
  // ADD YOUR FAVORITE SONG IDs HERE
  // Format: 'SPOTIFY_TRACK_ID'
  
  // Example songs (uncomment and modify as needed):
  // '4cOdK2wGLETKBW3PvgPWqT', // Blinding Lights - The Weeknd
  // '0VjIjW4GlUZAMYd2vXMi3b', // As It Was - Harry Styles
  // '7xGfFoTpQ2E7fRF5lN10tr', // Flowers - Miley Cyrus
  '7HKRWMTErKh56EIBeFcmdf', // Sial - Mahalini
  '5QQlmUR2fIfrstMT0TMC97', // Jiwa Yang Bersedih - Ghea Indrawari
  
  // Your songs go here:
];

// Simple function to get your favorite track IDs
export const getDefaultFavoriteIds = () => {
  return MY_FAVORITE_TRACK_IDS;
};