document.addEventListener('DOMContentLoaded', () => {

    fetch('/profile-Details')
        .then((response) => response.json())
        .then((data) => {
            const userData = data.userDataDetails;
            const likedMovie = data.likedMoviesDetails;
            const watchList = data.watchListMoviesDetails;
            const reviews = data.reviewedMovies;

            // console.log(likedMovie);
            // console.log(userData);
            // console.log(watchList);
            // console.log(reviews)

            if (!userData) {
                console.error('User Data is missing');
                return window.location.href = '/';
            }

            //Section for getting the profile information
            const profileDetails = document.getElementById('profileDetails');
            profileDetails.innerHTML = `
                <img id="avatar" src="${userData.avatar ? userData.avatar : "/images/defaultAvatar.png"}" alt="User Avatar" class="profile-Img">
                <h2>${userData.givenName} ${userData.familyName}</h2>
                <div class="profile-Bio">
                    <p><i class="fa-solid fa-map-pin"></i> ${userData.location}</p>
                    <p class="bio"><i class="fa-solid fa-book"></i> ${userData.bio}</p>
                </div>
            `

            //Section for the Recently liked Movies
            const likedMoviesContainer = document.querySelector('.liked-Card');
            if (!Array.isArray(likedMovie)|| likedMovie.length === 0) {
                likedMoviesContainer.innerHTML = `<h3 class="no-List">No Liked Movies</h3>`
            } else {
                likedMoviesContainer.innerHTML = likedMovie.slice(0,4).map(movie => `
                    <div class="movie-Card">
                        <a href="/films/${movie.likedMovies.id}">
                            <img src="https://image.tmdb.org/t/p/w500${movie.likedMovies.poster_path}" alt="${movie.likedMovies.title}">
                            <p>${movie.likedMovies.title}</p>
                        </a>
                    </div>
                `).join('');
            }

            //Section for the watched movies
            const watchlistContainer = document.querySelector('.watchlist-Card')
            if (!Array.isArray(watchList) || watchList.length === 0) {
                watchlistContainer.innerHTML = `<h3 class="no-List">No movies added to watchlist</h3>`
            } else {
                watchlistContainer.innerHTML = watchList.slice(0,4).map(movie => `
                    <div class="movie-Card">
                        <a href="/films/${movie.watchListDetails.id}">
                            <img src="https://image.tmdb.org/t/p/w500${movie.watchListDetails.poster_path}" alt="${movie.watchListDetails.title}">
                            <p>${movie.watchListDetails.title}</p>
                        </a>
                    </div>
                    `)
            }

            //Section for the reviewed movies
            const reviewedMoviesContainer = document.querySelector('.review-List');
            if (!Array.isArray(reviews) || reviews.length === 0) {
                reviewedMoviesContainer.innerHTML = `<h3 class="no-List">No movies added to watchlist</h3>`;
            } else {
                reviewedMoviesContainer.innerHTML = reviews.sort((a, b) => new Date(b.reviewTime) - new Date(a.reviewTime))
                .slice(0,4).map(movie => `
                        <li class="review-Item">
                            <a href="/films/${movie.movieDetails.id}">
                                <div class="review-Img">
                                    <img src="https://image.tmdb.org/t/p/w500${movie.movieDetails.poster_path}" alt="${movie.movieDetails.title}">
                                </div>
                            </a>
                            <div class="review-Content">
                                <h4 class="movie-Title">${movie.movieDetails.title}</h4>
                                <div class="star-Rating" id="starRating-${movie.movieDetails.id}">
                                    ${[1, 2, 3, 4, 5].map(num => 
                                        `<span class="star" data-value="${num}" 
                                        ${movie.rating >= num ? 'style="color: gold;"' : ''}>★</span>`
                                    ).join('')}
                                </div>
                                <p class="review-Date"><span>Reviewed At: </span>${new Date(movie.reviewTime).toLocaleDateString("en-US",{
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric'
                                })}
                                </p>
                                <p><span>Review: </span>${movie.review}</p>
                            </div>
                        </li>
                    `).join("");
            }

        })
        .catch((error) => {
            console.error("Error fetching data: ",error)
        })
})