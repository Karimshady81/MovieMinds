let currentPage = 1;
const showMoreButton = document.getElementById('showMoreBTN');

const fetchMovies = (page) => {
    fetch(`/all-films?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const { movies, hasMore } = data;
            const movieList = document.getElementById('allFilmsList');
            
            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.innerHTML = `
                <div class="movie-Banner">
                        <a href="/films/${movie.id}">
                        <div class="movie-Front">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                            <p class="title">${movie.title}</p>
                        </div>
                        <div class="movie-Back">
                            <h1>${movie.title} </h1>
                            <p><span>Release Date: </span>${movie.release_date}</p>
                            <p><span>Rating: </span>${Math.round(movie.vote_average * 10) / 10 } / 10</p>
                        </div>
                        </a>
                </div>
                `;
                movieList.appendChild(movieItem);
            });

            if (!hasMore) {
                showMoreButton.style.display = 'none'; // Hide button if no more pages
            }
        })
        .catch(error => console.error("Error fetching movies:", error));
};

// Initial fetch
fetchMovies(currentPage);

// On "Show More" button click
showMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
});
