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
  const [movies, setMovies] = useState([]); // 영화 목록 상태
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 상태
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [count, setCount] = useState(''); // 영화 개수 상태
  const [searchType, setSearchType] = useState('random'); // 검색 타입 상태 (random, latest, genre)
  const [selectedGenre, setSelectedGenre] = useState(null); // 선택된 장르 상태
  const [language, setLanguage] = useState('eng'); // 언어 상태 (영어: eng, 한글: kor)

  // API URL을 환경 변수에서 가져옴
  const API_URL = process.env.REACT_APP_API_URL;

  // 영화 목록을 가져오는 함수
  const fetchMovies = async (movieCount = '') => {
    try {
      setLoading(true);
      let apiEndpoint = '';

      if (searchType === 'random') {
        apiEndpoint = `${API_URL}/random/${movieCount}`;
      } else if (searchType === 'latest') {
        apiEndpoint = `${API_URL}/latest/${movieCount}`;
      } else if (searchType === 'genre' && selectedGenre) {
        apiEndpoint = `${API_URL}/genres/${selectedGenre}/${movieCount}`;
      }

      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setMovies(data); // 영화 목록 상태 업데이트
      setError(null); // 에러 초기화
    } catch (err) {
      setError('영화 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 영화 목록에서 영화를 클릭했을 때 상세 정보 표시
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // 영화 상세 정보 닫기
  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  // 언어 선택 변경 함수
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 영화 목록 🎬</h1>

        {/* 영화 검색 옵션 */}
        <div className="search-options">
          <button
            onClick={() => {
              setSearchType('random');
              setSelectedGenre(null);
            }}
            className={searchType === 'random' ? 'active' : ''}
          >
            랜덤 영화
          </button>
          <button
            onClick={() => {
              setSearchType('latest');
              setSelectedGenre(null);
            }}
            className={searchType === 'latest' ? 'active' : ''}
          >
            최신 영화
          </button>
          <button onClick={() => setSearchType('genre')} className={searchType === 'genre' ? 'active' : ''}>
            장르별 영화
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
            placeholder="영화 개수를 입력하세요"
            className="movie-count-input"
            min={1}
          />{' '}
          <button onClick={() => fetchMovies(count)} className="search-button">
            검색
          </button>
        </div>

        {/* 언어 선택 버튼 */}
        <div className="language-toggle">
          <button onClick={() => setLanguage('eng')} className={language === 'eng' ? 'active' : ''}>
            영어
          </button>
          <button onClick={() => setLanguage('kor')} className={language === 'kor' ? 'active' : ''}>
            한글
          </button>
        </div>

        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="movie-list">
            {/* 영화 목록이 없을 때 보여줄 메시지 */}
            {movies.length === 0 && <p>영화를 검색해 주세요.</p>}

            {/* 영화 목록이 있을 때는 영화 카드들을 보여줌 */}
            {movies.length > 0 &&
              movies.map((movie) => (
                <div key={movie.movieId} className="movie-item" onClick={() => handleMovieClick(movie)}>
                  <img
                    src={language === 'eng' ? movie.poster_path_eng : movie.poster_path_kor}
                    alt={language === 'eng' ? movie.title_eng : movie.title_kor}
                    className="movie-thumbnail"
                  />
                  <h3 className="movie-title">{language === 'eng' ? movie.title_eng : movie.title_kor}</h3>
                  <p className="movie-genre">{language === 'eng' ? movie.genres_eng : movie.genres_kor}</p>
                </div>
              ))}
          </div>
        )}

        {selectedMovie && (
          <div className="movie-detail-overlay" onClick={handleCloseDetail}>
            <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
              <img
                src={language === 'eng' ? selectedMovie.poster_path_eng : selectedMovie.poster_path_kor}
                alt={language === 'eng' ? selectedMovie.title_eng : selectedMovie.title_kor}
                className="movie-poster"
              />
              <h2>{language === 'eng' ? selectedMovie.title_eng : selectedMovie.title_kor}</h2>
              <p>
                {language === 'eng' ? 'Genre' : '장르'}:{' '}
                {language === 'eng' ? selectedMovie.genres_eng : selectedMovie.genres_kor}
              </p>
              <p>
                {language === 'eng' ? 'Movie Info Link' : '영화 정보 링크'}:{' '}
                <a
                  href={language === 'eng' ? selectedMovie.tmdburl_eng : selectedMovie.tmdburl_kor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {language === 'eng' ? selectedMovie.tmdburl_eng : selectedMovie.tmdburl_kor}
                </a>
              </p>
              <p>
                {language === 'eng' ? 'Average Rating' : '평균 평점'}:{' '}
                {language === 'eng' ? selectedMovie.rating_avg_eng : selectedMovie.rating_avg_kor}
              </p>
              <p>
                {language === 'eng' ? 'Rating Count' : '평점 수'}:{' '}
                {language === 'eng' ? selectedMovie.rating_count_eng : selectedMovie.rating_count_kor}
              </p>
              <button onClick={handleCloseDetail} className="close-detail-button">
                {language === 'eng' ? 'Close' : '닫기'}
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
