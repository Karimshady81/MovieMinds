document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile-Details')
        .then((response) => response.json())
        .then((data) => {
            const userData = data.userDataDetails;
            const reviews = data.reviewedMovies;

            console.log(reviews);
            
            if (!userData){
                console.error('User Data is missing');
                return window.location.href = '/';
            }

            //Section for reviewed Movies
            const reviewedMoviesContainer = document.querySelector('.review-Movies-Grid');
            const noList = document.querySelector('.no-review');
            if (!Array.isArray(reviews)|| reviews.length === 0) {
                noList.innerHTML = `<h3 class="no-List">No Reviewed Movies Available</h3>`
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
                                <h4 class="movie-Title">${movie.movieDetails.title} (${new Date(movie.movieDetails.release_date).toLocaleDateString("en-US", {
                                    year: 'numeric'
                                })})</h4>
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
});