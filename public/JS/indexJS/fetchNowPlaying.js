document.addEventListener('DOMContentLoaded', () => {
    fetch('/now-playing')
        .then((response) => response.json()) //Parse the JSON response
        .then((data) => {
            const movies = data.movies;
            const movieList = document.getElementById('nowPlayingList') //Find the container oin the HTML

            movies.forEach((movie) => {
                const movieItem = document.createElement('a');
                movieItem.innerHTML = `
                    <div class="movie-Banner"> 
                        <a href="/films/${movie.id}">
                        <div class="movie-Front">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                            <p class="movie-title">${movie.title}</p>
                        </div>
                        <div class="movie-Back">
                            <h2>${movie.title}</h2>
                            <p><span>Release Date: </span>${movie.release_date}</p>
                            <p><span>Rating: </span>${Math.round(movie.vote_average * 10) / 10} / 10</p>
                        </div>
                        </a>
                    </div>
                `;
                movieList.appendChild(movieItem); //Add the movie to the container
            });

            // console.log(data); For testing purposes
        })
        .catch((error) => {
            console.error('Error fetching movies: ',error);
        })
});


