document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");

    // Prevent default form submission & fetch movies dynamically
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchTerm = document.getElementById("searchInput").value.trim();

        if (searchTerm) {
            window.location.href = `/searched-films?query=${encodeURIComponent(searchTerm)}`;
        }
    });

    let currentPage = 1;
    const showMoreButton = document.getElementById('showMoreBTN');

    const fetchMovies = (page, searchTerm) => {
        fetch(`/searched-movies?query=${encodeURIComponent(searchTerm)}&page=${page}`)
            .then((response) => response.json())
            .then(data => {
                const { movies } = data;
                const movieList = document.getElementById('allFilmsList');

                // Clear previous results on new search
                if (page === 1) {
                    movieList.innerHTML = '';
                }

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

                // Show "Load More" button only if more results exist
                if (data.hasMore) {
                    showMoreButton.style.display = "block";
                    showMoreButton.onclick = () => {
                        currentPage++;
                        fetchMovies(currentPage, searchTerm);
                    };
                } else {
                    showMoreButton.style.display = "none";
                }
            })
            .catch(error => console.error("Error fetching movies:", error));
    };

    // Fetch results when page loads (if redirected with a search query)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");
    if (searchQuery) {
        fetchMovies(1, searchQuery);
    }
});
