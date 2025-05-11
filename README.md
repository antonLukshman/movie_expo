# Movie Explorer App

A modern React application for searching movies, viewing details, and discovering trending films, built with React, Material-UI, and The Movie Database (TMDb) API.

## Features

- **User Authentication**: Login interface with username and password
- **Search Functionality**: Search for movies using the TMDb API
- **Movie Grid View**: Responsive grid displaying movie posters with titles, release years, and ratings
- **Movie Details**: Comprehensive movie information including overview, genre, cast, and trailers
- **Trending Movies Section**: Display popular movies from the TMDb API
- **Dark/Light Mode**: Toggle between dark and light themes for better user experience
- **Favorites Management**: Save and manage favorite movies with local storage persistence
- **Responsive Design**: Mobile-first approach ensuring great experience across all devices
- **Advanced Filtering**: Filter movies by genre, year, or rating

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- TMDb API Key (sign up at https://www.themoviedb.org/signup and get an API key)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/movie-explorer.git
   cd movie-explorer
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your TMDb API key:

   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   ```

4. Edit the `src/api/tmdbApi.js` file and replace `'YOUR_TMDB_API_KEY'` with:

   ```javascript
   const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
   ```

5. Start the development server:

   ```
   npm start
   ```

   or

   ```
   yarn start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
movie-explorer/
├── public/               # Static files
├── src/
│   ├── api/              # API services and configuration
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable components
│   │   ├── common/       # Header, Footer, ThemeToggle, etc.
│   │   ├── movies/       # Movie-related components
│   │   └── user/         # User-related components
│   ├── context/          # React context for state management
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── styles/           # Theme and global styles
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app component with routing
│   └── index.js          # Entry point
└── package.json          # Dependencies and scripts
```

## Technologies Used

- **React**: Frontend library for building user interfaces
- **React Router**: Navigation and routing
- **Material-UI**: React component library implementing Google's Material Design
- **Axios**: HTTP client for API requests
- **Framer Motion**: Animation library
- **TMDb API**: Movie database API
- **Local Storage**: For persisting user preferences and favorites

## Additional Features

- **Infinite Scrolling**: Implemented for search results for better UX
- **Responsive Images**: Optimized image loading with different sizes based on viewport
- **Error Handling**: Graceful error handling for API failures
- **Loading States**: Visual feedback during data fetching
- **Trailer Playback**: YouTube integration for movie trailers
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Skeleton Loading**: Loading placeholders for better perceived performance

## Future Enhancements

- User registration and profile management
- Server-side authentication
- Movie recommendations based on user preferences
- Custom movie lists (watched, to watch, etc.)
- Social sharing features
- Advanced search filters
- Performance optimizations for image loading

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the API
- [Material-UI](https://mui.com/) for the component library
- [Create React App](https://create-react-app.dev/) for the project setup
