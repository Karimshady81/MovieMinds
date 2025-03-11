document.addEventListener('DOMContentLoaded', () => {
    
    const movieId = window.location.pathname.split('/').pop(); //Extract the last part of the URL
    
    fetch(`/film-details/${movieId}`)
        .then((response) => response.json()) //Parse the response
        .then((data) => {
            const movie = data.movie;
            const trailer = data.trailer;
            const credits = data.credits;
            const provider = data.provider;
            const reviews = data.reviews;
            const user = data.user;
            const userActions = data.userActions || {};
            const userReview = data.saveReview;
            
            // console.log("User Actions:", userActions);
            // console.log(user);
            // console.log(movie);
            // console.log(trailer);
            // console.log(credits);
            // console.log(provider);
            // console.log(reviews);
            // console.log("Fetched data", data)
            // console.log(userActions.rating);
            // console.log  (userReview);

            //Section for getting the poster and details of the movie
            const moviePoster = document.getElementById('filmPoster');
            moviePoster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`

            const crewList = {
                directors: [],
                producers: [],
                writers: [],
                editors: [],
                cinematographers: [],
                visualeffects: [],
                sound: []
            }
            credits.crew.forEach(crewMember => {
                if (crewMember.department === "Directing") crewList.directors.push(crewMember.name);
                if (crewMember.department === "Production") crewList.producers.push(crewMember.name);
                if (crewMember.department === "Writing") crewList.writers.push(crewMember.name);
                if (crewMember.department === "Editing") crewList.editors.push(crewMember.name);
                if (crewMember.department === "Camera") crewList.cinematographers.push(crewMember.name);
                if (crewMember.department === "Visual Effects") crewList.visualeffects.push(crewMember.name);
                if (crewMember.department === "Sound") crewList.sound.push(crewMember.name);
            });

            
            const director = crewList.directors.length > 0 ? crewList.directors[0] : "Unknown director"
            //Proccess the Actors
            const casts = credits.cast.filter(person => person.known_for_department === "Acting")
          
            // Select the parent container where tabs and content will go
            const tabsContainer = document.querySelector(".tabs")
            const contentContainer = document.querySelector(".tab-Content")

            // Function to generate tabs and their corresponding content
            function createTabs(data) {
                Object.keys(data).forEach((key, index) => {
                    // Create a Tab
                    const tab = document.createElement("button");
                    tab.classList.add("tab");
                    if (index === 0) tab.classList.add("active"); // First tab active by default
                    tab.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
                    tab.setAttribute("data-tab", key); // Associate this tab with a content section
                    tabsContainer.appendChild(tab);
            
                    // Create Corresponding Content Section
                    const content = document.createElement("div");
                    content.id = key;
                    content.classList.add("content");
                    if (index === 0) content.classList.add("active"); // First content active by default
            
                    // Populate Content Based on Data Type
                    if (key === "cast") {
                        data[key].forEach(name => {
                            const item = document.createElement("div");
                            item.classList.add("cast");
                            item.innerHTML = `
                            <p class="cast-Name">${name.name}</p>
                            <p class="cast-Character">${name.character}</p> `;
                            content.appendChild(item);
                        });
                    } else if (key === "crew") {
                        Object.keys(data[key]).forEach(crewType => {
                            const section = document.createElement("div");
                            const heading = document.createElement("h4");
                            heading.classList.add("crew-Title");
                            heading.textContent = crewType.toUpperCase();
                            section.appendChild(heading);
            
                            data[key][crewType].forEach(person => {
                                const personItem = document.createElement("div");
                                personItem.classList.add("crew-Person")
                                personItem.textContent = person;
                                section.appendChild(personItem);
                            });
                            content.appendChild(section);
                        });
                    } else {
                        data[key].forEach(item => {
                            const itemElement = document.createElement("div");
                            itemElement.classList.add("genre")
                            itemElement.textContent = item;
                            content.appendChild(itemElement);
                        });
                    }
            
                    contentContainer.appendChild(content);
                });
            
                // Add Tab Switching Logic
                addTabFunctionality();
            }
            
            
            // Function to handle tab switching
            function addTabFunctionality() {
                const tabs = document.querySelectorAll(".tab");
                const contents = document.querySelectorAll(".content");
            
                tabs.forEach(tab => {
                    tab.addEventListener("click", () => {
                        // Remove active class from all tabs and contents
                        tabs.forEach(t => t.classList.remove("active"));
                        contents.forEach(c => c.classList.remove("active"));
            
                        // Add active class to the clicked tab and its corresponding content
                        tab.classList.add("active");
                        const target = tab.getAttribute("data-tab");
                        document.getElementById(target).classList.add("active");
                    });
                });
            }            
            
            const tabData = {
                cast: casts.map(cast => ({
                    name: cast.name,
                    character: cast.character
                })), // Array of cast names
                crew: crewList, // Entire crewList object
                genres: movie.genres.map(genre => genre.name), // Assuming `movie.genres` is an array
                releaseDates: [movie.release_date] // Wrap in array for consistency
            };

            // Call the function to create tabs dynamically
            createTabs(tabData);

            //Section for getting the movie details
            const movieInfo = document.getElementById('movieInfo');
            movieInfo.innerHTML = `
                <h1>${movie.title}</h1>
                <p><span>Release Year: </span> ${movie.release_date}</p>
                <p><span>Directed By: </span> ${director}</p>
                <p class="description"> ${movie.overview}</p>
                <div class = "rates-Container">
                    <p><span>Rating: </span> ${Math.round(movie.vote_average * 10) / 10} / 10</p>
                    <div class = "rate-Box">
                        
                    </div>  
                </div>
            `
            //Section for the rating Box
            const ratingBox = document.querySelector('.rate-Box');
            if (!user) {
                ratingBox.innerHTML = 
                ` <h1 class="add-Review">Sign in to add a review</h1> `
            }
            else {
                ratingBox.innerHTML = `
                    <div class="movie-Panel">
                        <input type="hidden" id="movieId" value="${movieId}">
                        
                        <div class="actions">
                            <button id="watchedBtn" class="${userActions.watched ? 'active' : ''}">
                                <i class="fa fa-eye"></i> ${userActions.watched ? "Watched" : "Watch"}
                            </button>
    
                            <button id="likedBtn" class="${userActions.liked ? 'active' : ''}">
                                <i class="fa fa-heart"></i> ${userActions.liked ? "Liked" : "Like"} 
                            </button>
    
                            <button id="watchListBtn" class="${userActions.watchlist ? '' : ''}">
                                ${userActions.watchlist ? `<i class="fa-solid fa-check" style="color: #63E6BE;"></i> WatchList` : `<i class="fa fa-plus"></i> WatchList`}
                            </button>
                        </div>
    
                        <div class="rating">
                            <div class="stars" id="starRating">
                                    <span data-value="1">★</span>
                                    <span data-value="2">★</span>
                                    <span data-value="3">★</span>
                                    <span data-value="4">★</span>
                                    <span data-value="5">★</span>
                            </div>
                        </div>

                        <div class="review-Input">

                        </div>
                    </div>
                `;
            }
            addActionListeners(movieId)

            //Section for the users review
            const reviewInputContainer = document.querySelector('.review-Input');
            if (userActions.review) {
                reviewInputContainer.innerHTML = `<button id="reviewLog" class="review-Log">Edit Review</button>`
            }
            else {
                reviewInputContainer.innerHTML = `<button id="reviewLog" class="review-Log">Review or Log...</button>`
            }

            //Action for displaying the review box
            document.getElementById('reviewLog').addEventListener("click", () => {
                document.querySelector('.review-Form').classList.add('show-review');
                document.getElementById('reviewFormBox').innerHTML = `
                    <div class="review-Modal-Content">
                        <span class="close">&times;</span>
                        <div class="movie-Form-Poster">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        </div>
                        <div id="reviewForm" class="review-Form-Content">
                            <h3>I watched...</h3>
                            <h1>${movie.title}</h1>
                            <p>Released: <span>${movie.release_date}</span></p>
                            <p style="color: hsl(208, 11%, 46%);">Leave your review: </p>
                            <p id="reviewMessageRes" style=" color: hsl(36, 80%, 58%);"></p>
                            <textarea id="reviewTextArea" name="reviewTextArea">${userActions.review || ''}</textarea>
                            <div class="star-Rating-Film" id="starRating-${movie.id}">
                                    ${[1, 2, 3, 4, 5].map(num => 
                                        `<span class="star" data-value="${num}" 
                                        ${userActions.rating >= num ? 'style="color: gold;"' : ''}>★</span>`
                                    ).join('')}
                            </div>
                            <div class="review-BTN">
                                <button id="deleteReview" class="delete-BTN">delete</button>
                                <button type="submit" id="saveReview" class="save-BTN">save</button>
                            </div>
                        </div>
                    </div>
                    `
                    //Handling the review sumbmission
                    document.getElementById('saveReview').addEventListener('click', () => {
                        const messageResponse = document.getElementById('reviewMessageRes');
        
                        fetch('/addReview', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                movieId: movie.id,
                                review: document.getElementById('reviewTextArea').value
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            messageResponse.innerHTML = data.message 
                        })
                        .catch(error => {
                            console.error("Error adding review",error)
                        })
                    })

                    document.getElementById('deleteReview').addEventListener('click', () => {
                        const messageResponse = document.getElementById('reviewMessageRes');
        
                        fetch('/removeReview', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                movieId: movie.id,
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (messageResponse) {
                                messageResponse.innerHTML = data.message; // Display response message
                            }                     
                            
                            document.getElementById('reviewTextArea').value = '';
                        })
                        .catch(error => {
                            console.error("Error adding review",error)
                        })
                    })
            })            

            
            document.addEventListener("click", (event) => {
                const reviewForm = document.querySelector('.review-Form');
                const reviewBox = document.querySelector('.review-Modal-Content');
                const closeBTN = document.querySelector('.close');

                closeBTN.onclick = () => {
                    reviewForm.classList.remove('show-review');
                }
            
                // Check if the clicked element is outside the modal
                if (reviewForm.classList.contains('show-review') && !reviewBox.contains(event.target) && event.target !== document.getElementById('reviewLog')) {
                    reviewForm.classList.remove('show-review');
                }
            });

            //The Section for the stars rating 
            const stars = document.querySelectorAll("#starRating span");

            stars.forEach(star => {
                star.addEventListener("click", () => {
                    const rating = star.getAttribute("data-value");

                    // Remove 'active' class from all stars
                    stars.forEach(s => s.classList.remove("active"));

                    // Add 'active' class to clicked stars and those before it
                    for (let i = 0; i < rating; i++) {
                        stars[i].classList.add("active");
                    }

                    // Save rating in the database
                    updateRating(rating);
                });
            });

            //If there is a rating show the rated value
            if (userActions.rating) {
                const savedRating = userActions.rating;
                const stars = document.querySelectorAll("#starRating span");
                for (let i = 0; i < savedRating; i++) {
                    stars[i].classList.add("active");
                }
            }

            //Section for getting the movie trailer
            const finalTrailer = trailer.results.find(trailer => trailer.type === 'Trailer');
            const trailerURL = finalTrailer ? `https://www.youtube-nocookie.com/embed/${finalTrailer.key}` : null;

            const movieTrailer = document.getElementById('movieTrailer')
            movieTrailer.innerHTML = `
                <span class="close-Trailer">&times;</span>
                <iframe id="videoPlayer" class="frame" src="${trailerURL}" width="100%" height="700px"></iframe>
            `
            
            // Dispatch a custom event to notify that the trailer is ready
            document.dispatchEvent(new CustomEvent('trailerReady'))

            //Section for gettinh the movie providers
            const rentAndBuy = {};
            Object.keys(provider.results).forEach(region => {
                if (region === 'US'){
                    if (provider.results[region].rent){
                        provider.results[region].rent.forEach(provider => {
                            if (!rentAndBuy[provider.provider_name]){
                                rentAndBuy[provider.provider_name] = {
                                    name: provider.provider_name,
                                    logo: `https://image.tmdb.org/t/p/w45/${provider.logo_path}`,
                                    rent: true,
                                    buy: false
                                };
                            }
                        });
                    }
                }
                if (provider.results[region].buy){
                    provider.results[region].buy.forEach(provider => {
                        if (rentAndBuy[provider.provider_name]){
                            rentAndBuy[provider.provider_name].buy = true
                        }
                        else {
                            rentAndBuy[provider.provider_name] = {
                                name: provider.provider_name,
                                logo: `https://image.tmdb.org/t/p/w45/${provider.logo_path}`,
                                rent: false,
                                buy: true
                            }
                        }
                    });
                };
            });
            
            const providerList = document.getElementById('providerList');
            if (provider && Object.keys(rentAndBuy).length > 0) {
                //Generate HTML for provider
                providerList.innerHTML = Object.values(rentAndBuy).map(provider => `
                    <li>
                        <img src="${provider.logo}" alt="${provider.name} Logo">
                        <span>${provider.name}</span>
                        ${
                            provider.rent && provider.buy
                                ? '<span>BUY & RENT</span>'
                                : provider.rent
                                ? '<span>RENT</span>'
                                : provider.buy
                                ? '<span>BUY</span>'
                                : ''
                        }
                    </li>
                    `)
                    .join('')
            }
            else {
                //Display "No Provider"
                providerList.innerHTML = `<span>No Services Available At The Moment</span>`
            }

            //Function that converts plain text to URLs
            function linkify(text) {
                const urlPattern = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: hsl(36, 80%, 58%)">$1</a>');
            }

            //Section for getting the reviews
            const reviewList = reviews.results.map(review => ({
                author: review.author,
                rating: review.author_details.rating,
                content: linkify(review.content),
                avatar: review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}` : "/images/defaultAvatar.png"
            })) 

            const reviewContainer = document.querySelector(".review-Container");
            reviewContainer.innerHTML = reviewList
                .map(
                    review => `
                    <div class="review">
                        <div class="profile-Section">
                            <img src="${review.avatar}" alt="Avatar" class="profile-Img">
                            <span>Review by: <p>${review.author}</p></span>
                            <span>Rating: <p>${review.rating}/10</p></span>
                        </div>
                        <div class="review-Section">
                            <p>${review.content}</p>
                        </div>
                    </div>
                    `
                )
                .join(""); // Join all the HTML strings

        })  
})


function addActionListeners(movieId) {
    document.getElementById("watchedBtn")?.addEventListener("click", () => toggleAction(movieId, "watched"));
    document.getElementById("likedBtn")?.addEventListener("click", () => toggleAction(movieId, "liked"));
    document.getElementById("watchListBtn")?.addEventListener("click", () => toggleAction(movieId, "watchList"));
}

function toggleAction(movieId, action) {
    fetch('/user/action', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ movieId, action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // console.log(data.action);

            if (data.action.watched === true) {
                // Toggle button class dynamically
                const btn = document.getElementById("watchedBtn");
                btn.innerHTML = `<i class="fa fa-eye"></i> Watched`
                btn.classList.add("active");
            }
            else if (data.action.watched === false) {
                const btn = document.getElementById("watchedBtn");
                btn.innerHTML = `<i class="fa fa-eye"></i> Watch`
                btn.classList.remove("active");
            } 
            
            if (data.action.liked === true) {
                // Toggle button class dynamically
                const btn = document.getElementById("likedBtn");
                btn.innerHTML = `<i class="fa fa-heart"></i> Liked`
                btn.classList.add("active");
            }
            else{
                const btn = document.getElementById("likedBtn");
                btn.innerHTML = `<i class="fa fa-heart"></i> Like`
                btn.classList.remove("active");
            }
            
            if (data.action.watchList === true) {
                // Toggle button class dynamically
                const btn = document.getElementById("watchListBtn");
                btn.innerHTML = `<i class="fa-solid fa-check" style="color: #63E6BE;"></i> WatchList`
            }
            else {
                const btn = document.getElementById("watchListBtn");
                btn.innerHTML = `<i class="fa fa-plus"></i> WatchList`
            }
        }
    })
    .catch(error => console.error("Error updating action: ",error));
}

// Function to save rating in the database
function updateRating(rating) {
    const movieId = document.getElementById("movieId").value;
    fetch("/user/rating", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ movieId, rating })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Rating saved successfully:", data);
    })
    .catch(error => console.error("Error saving rating:", error));
}