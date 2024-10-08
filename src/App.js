import React, { useState } from 'react';
import './App.css';

const genresList = [
  'Action',
  'Adventure',
  'Animation',
  'Children',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Film-Noir',
  'Horror',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState('');
  const [searchType, setSearchType] = useState('random');
  const [selectedGenre, setSelectedGenre] = useState('Action');
  const [language, setLanguage] = useState('eng'); // 전체 페이지 언어
  const [showTrailer, setShowTrailer] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchMovies = async (movieCount = '') => {
    try {
      setLoading(true);
      let apiEndpoint = '';
      if (searchType === 'random') apiEndpoint = `${API_URL}/random/${movieCount}`;
      else if (searchType === 'latest') apiEndpoint = `${API_URL}/latest/${movieCount}`;
      else if (searchType === 'genre' && selectedGenre)
        apiEndpoint = `${API_URL}/genres/${selectedGenre}/${movieCount}`;

      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError('영화 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
    setShowTrailer(false); // 트레일러 팝업 상태 초기화
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{language === 'eng' ? '🎬 Movie Search 🎬' : '🎬 영화 검색 🎬'}</h1>

        {/* 검색 옵션 버튼 */}
        <div className="search-options">
          <button
            onClick={() => {
              setSearchType('random');
              setSelectedGenre(null);
            }}
            className={searchType === 'random' ? 'active' : ''}
          >
            {language === 'eng' ? 'Random Movies' : '랜덤 영화'}
          </button>
          <button
            onClick={() => {
              setSearchType('latest');
              setSelectedGenre(null);
            }}
            className={searchType === 'latest' ? 'active' : ''}
          >
            {language === 'eng' ? 'Latest Movies' : '최신 영화'}
          </button>
          <button onClick={() => setSearchType('genre')} className={searchType === 'genre' ? 'active' : ''}>
            {language === 'eng' ? 'Genres Movies' : '장르별 영화'}
          </button>
        </div>

        {/* 장르 선택 버튼 */}
        {searchType === 'genre' && (
          <div className="genre-list">
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? 'genre-active' : ''}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <div className="movie-count-container">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder={language === 'eng' ? 'Enter number of movies' : '영화 개수를 입력하세요'}
            className="movie-count-input"
            min={1}
          />
          <button onClick={() => fetchMovies(count)} className="search-button">
            {language === 'eng' ? 'Search' : '검색'}
          </button>
        </div>

        {/* 전체 언어 선택 버튼 */}
        <div className="language-toggle">
          <button onClick={() => handleLanguageChange('eng')} className={language === 'eng' ? 'active' : ''}>
            {language === 'eng' ? 'English' : '영어'}
          </button>
          <button onClick={() => handleLanguageChange('kor')} className={language === 'kor' ? 'active' : ''}>
            {language === 'kor' ? '한글' : 'Korean'}
          </button>
        </div>

        {loading ? (
          <p>{language === 'eng' ? 'Loading...' : '로딩 중...'}</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="movie-list">
            {movies.length === 0 && <p>{language === 'eng' ? 'Please search for movies.' : '영화를 검색해 주세요.'}</p>}
            {movies.map((movie) => (
              <div key={movie.movieId} className="movie-item" onClick={() => handleMovieClick(movie)}>
                <img
                  src={language === 'eng' ? movie.poster_path_eng : movie.poster_path_kor}
                  alt={language === 'eng' ? movie.title_eng : movie.title_kor}
                  className="movie-thumbnail"
                />
                <h3 className="movie-title">{language === 'eng' ? movie.title_eng : movie.title_kor}</h3>
                <p className="movie-genre">{language === 'eng' ? movie.genres_eng : movie.genres_kor}</p>
                <p className="movie-year">{language === 'eng' ? movie.year_eng : movie.year_kor}</p>
              </div>
            ))}
          </div>
        )}

        {/* 상세 페이지 */}
        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            defaultLanguage={language} // 기본 언어 전달
            onClose={handleCloseDetail}
            showTrailer={showTrailer}
            setShowTrailer={setShowTrailer}
          />
        )}
      </header>
    </div>
  );
}

function MovieDetail({ movie, defaultLanguage, onClose, showTrailer, setShowTrailer }) {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage); // 상세 페이지의 독립적인 언어 상태
  const [showFullInfo, setShowFullInfo] = useState(false); // 상세 페이지 내부의 showFullInfo 상태

  // 트레일러 URL을 공통으로 정의
  const trailerURL = movie.trailer_url_eng || movie.trailer_url_kor;

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
        <div className="movie-detail-header">
          <h2>
            {selectedLanguage === 'eng' ? movie.title_eng : movie.title_kor} -
            {selectedLanguage === 'eng' ? movie.year_eng : movie.year_kor}
          </h2>

          {/* 언어 선택 버튼 (상세 페이지 내) */}
          <div className="detail-language-toggle">
            <button onClick={() => setSelectedLanguage('eng')} className={selectedLanguage === 'eng' ? 'active' : ''}>
              {selectedLanguage === 'eng' ? 'English' : '영어'}
            </button>
            <button onClick={() => setSelectedLanguage('kor')} className={selectedLanguage === 'kor' ? 'active' : ''}>
              {selectedLanguage === 'kor' ? '한글' : 'Korean'}
            </button>
          </div>
        </div>

        <div className="movie-detail-content">
          <img
            src={selectedLanguage === 'eng' ? movie.poster_path_eng : movie.poster_path_kor}
            alt={selectedLanguage === 'eng' ? movie.title_eng : movie.title_kor}
            className="movie-poster-large"
          />
          <div className="movie-info">
            <p>
              {selectedLanguage === 'eng' ? 'Genre' : '장르'}:{' '}
              {selectedLanguage === 'eng' ? movie.genres_eng : movie.genres_kor}
            </p>
            <p className={`detail-sub ${showFullInfo ? 'expanded' : 'collapsed'}`}>
              {selectedLanguage === 'eng' ? movie.info_eng : movie.info_kor}
            </p>

            {/* 더보기 버튼 */}
            {(selectedLanguage === 'eng' && movie.info_eng.length > 200) ||
            (selectedLanguage === 'kor' && movie.info_kor.length > 200) ? (
              <button onClick={() => setShowFullInfo(!showFullInfo)} className="toggle-info-button">
                {showFullInfo
                  ? selectedLanguage === 'eng'
                    ? 'Show Less'
                    : '간략히 보기'
                  : selectedLanguage === 'eng'
                  ? 'Show More'
                  : '더보기'}
              </button>
            ) : null}

            <p className="no-wrap">
              {selectedLanguage === 'eng' ? 'Movie Info Link' : '영화 정보 링크'}:
              <a
                href={selectedLanguage === 'eng' ? movie.tmdburl_eng : movie.tmdburl_kor}
                target="_blank"
                rel="noopener noreferrer"
                className="info-link-button"
              >
                {selectedLanguage === 'eng' ? 'Go to Info' : '이동하기'}
              </a>
            </p>

            {/* 트레일러 버튼: 트레일러 URL이 있을 때만 표시 */}
            {trailerURL && (
              <p>
                {selectedLanguage === 'eng' ? 'Trailer' : '트레일러'}:
                <button onClick={() => setShowTrailer(true)} className="trailer-button">
                  {selectedLanguage === 'eng' ? 'Watch Trailer' : '트레일러 보기'}
                </button>
              </p>
            )}

            <p>
              {selectedLanguage === 'eng' ? 'Average Rating' : '평균 평점'}:{' '}
              {selectedLanguage === 'eng' ? movie.rating_avg_eng : movie.rating_avg_kor}
            </p>
            <p>
              {selectedLanguage === 'eng' ? 'Rating Count' : '평점 수'}:{' '}
              {selectedLanguage === 'eng'
                ? Number(movie.rating_count_eng).toLocaleString()
                : Number(movie.rating_count_kor).toLocaleString()}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="close-detail-button">
          {selectedLanguage === 'eng' ? 'Close' : '닫기'}
        </button>

        {showTrailer && (
          <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
            <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowTrailer(false)} className="close-trailer-button">
                X
              </button>
              <iframe
                width="560"
                height="315"
                src={trailerURL.replace('watch?v=', 'embed/')}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
