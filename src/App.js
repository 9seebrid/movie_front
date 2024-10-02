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

  // 영화 목록을 가져오는 함수
  const fetchMovies = async (movieCount = '') => {
    try {
      setLoading(true);
      let apiEndpoint = '';

      if (searchType === 'random') {
        apiEndpoint = `http://localhost:8002/random/${movieCount}`;
      } else if (searchType === 'latest') {
        apiEndpoint = `http://localhost:8002/latest/${movieCount}`;
      } else if (searchType === 'genre' && selectedGenre) {
        apiEndpoint = `http://localhost:8002/genres/${selectedGenre}/${movieCount}`;
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
                  <img src={movie.poster_path} alt={movie.title} className="movie-thumbnail" />
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-genre">{movie.genres}</p>
                </div>
              ))}
          </div>
        )}

        {selectedMovie && (
          <div className="movie-detail-overlay" onClick={handleCloseDetail}>
            <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
              <img src={selectedMovie.poster_path} alt={selectedMovie.title} className="movie-poster" />
              <h2>{selectedMovie.title}</h2>
              <p>장르: {selectedMovie.genres}</p>
              <p>
                IMDB 링크:{' '}
                <a href={selectedMovie.url} target="_blank" rel="noopener noreferrer">
                  {selectedMovie.url}
                </a>
              </p>
              <p>평균 평점: {selectedMovie.rating_avg}</p>
              <p>평점 수: {selectedMovie.rating_count}</p>
              <button onClick={handleCloseDetail} className="close-detail-button">
                닫기
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
