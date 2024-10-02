import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]); // 영화 목록 상태
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 상태
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [count, setCount] = useState(5); // 영화 개수 상태

  // 영화 목록을 가져오는 함수
  const fetchMovies = async (movieCount = 5) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8002/random/${movieCount}`);
      const data = await response.json();
      setMovies(data); // 영화 목록 상태 업데이트
      setError(null); // 에러 초기화
    } catch (err) {
      setError('영화 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 페이지가 로드되면 영화 목록을 가져옴
  useEffect(() => {
    fetchMovies(count);
  }, [count]);

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
        <div className="movie-count-container">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="영화 개수를 입력하세요"
            className="movie-count-input"
            min={1}
          />
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
            {movies.map((movie) => (
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
