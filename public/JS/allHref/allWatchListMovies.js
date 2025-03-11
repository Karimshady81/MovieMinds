document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile-Details')
        .then((response) => response.json())
        .then((data) => {
            const userData = data.userDataDetails;
            const watchList = data.watchListMoviesDetails;

            // console.log(watchList);
            
            if (!userData){
                console.error('User Data is missing');
                return window.location.href = '/';
            }

            //Section for watchlist Movies
            const watchListMoviesContainer = document.querySelector('.watchlist-Movies-Grid');
            const noList = document.querySelector('.no-watchList');
            if (!Array.isArray(watchList)|| watchList.length === 0) {
                noList.innerHTML = `<h3 class="no-List">No Movies Available In The List</h3>`
            } else {
                watchListMoviesContainer.innerHTML = watchList.map(movie =>`
                        <div class="movie-Card">
                            <a href="/films/${movie.watchListDetails.id}">
                                <img src="https://image.tmdb.org/t/p/w500${movie.watchListDetails.poster_path}" alt="${movie.watchListDetails.title}">
                                <p>${movie.watchListDetails.title}</p>
                            </a>
                            <p class="review-Date"><span>Added To List At: </span>${new Date(movie.watchListTime).toLocaleDateString("en-US",{
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