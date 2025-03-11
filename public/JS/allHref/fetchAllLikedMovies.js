document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile-Details')
        .then((response) => response.json())
        .then((data) => {
            const userData = data.userDataDetails;
            const likedMovies = data.likedMoviesDetails;

            // console.log(likedMovies);
            
            if (!userData){
                console.error('User Data is missing');
                return window.location.href = '/';
            }

            //Section for liked Movies
            const likedMoviesContainer = document.querySelector('.liked-Movies-Grid');
            const noList = document.querySelector('.no-Liked');
            if (!Array.isArray(likedMovies)|| likedMovies.length === 0) {
                noList.innerHTML = `<h3 class="no-List">No liked Movies Available</h3>`
            } else {
                likedMoviesContainer.innerHTML = likedMovies.map(movie =>`
                        <div class="movie-Card">
                            <a href="/films/${movie.likedMovies.id}">
                                <img src="https://image.tmdb.org/t/p/w500${movie.likedMovies.poster_path}" alt="${movie.likedMovies.title}">
                                <p>${movie.likedMovies.title}</p>
                            </a>
                            <p class="review-Date"><span>Liked At: </span>${new Date(movie.likedTime).toLocaleDateString("en-US",{
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                            })}
                            </p>
                        </div>
                `).join('')
            }
        })  
});