const stars = document.querySelectorAll('.star-rating span');
const ratingContainer = document.querySelector('.star-rating');
const removeRating = document.getElementById('removeRating');
const movieID = document.getElementById('movieID').value;
let currentRating = document.getElementById('userRating').value;  // Get the rating value

// Initialize the star colors based on the current rating
updateStarColor(currentRating);

// Add event listeners to the stars
stars.forEach(star => {
    // On click, set the current rating
    star.addEventListener('click', () => {
        currentRating = star.getAttribute('data-value');
        updateStarColor(currentRating);

        // Save the rating to the database
        fetch('/saveRating', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                movieID: movieID,
                action: 'rated',
                rating: currentRating
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Rating saved successfully', data);
        })
        .catch(error => {
            console.error('Error saving rating: ', error);
        });

        removeRating.style.display = 'block';  // Show the "X" button after rating
        
        // Change the button content to "Watched"
        const watchBtn = document.getElementById('watchBtn');

        watchBtn.id = 'watchedBtn';
        watchBtn.innerHTML = '<i class="fa fa-eye"></i> Watched';

        // Change the button style to indicate "Watched"
        watchBtn.style.color = 'hsl(36, 80%, 58%)';

        // Change the onclick event to removeWatched (if the user wants to unmark it)
        watchBtn.onclick = removeWatched;

        // Save the watched action in the database (AJAX request)
        fetch('/saveRating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movieID: movieID,
                action: 'watched'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Watched action saved successfully', data);
        })
        .catch(error => {
            console.error('Error saving watched action:', error);
        });
        });

        // On hover, temporarily highlight the stars
        star.addEventListener('mouseover', () => {
            updateStarColor(star.getAttribute('data-value'));  // Temporarily show hover color
            removeRating.style.display = 'block';  // Show "X" button when hovering over stars
        });
});

// Add mouseout to reset the stars to the current rating
ratingContainer.addEventListener('mouseout', () => {
    updateStarColor(currentRating);  // Reset stars to the selected rating after mouseout

    // Hide the remove button if no rating is selected
    if (currentRating === 0) {
        removeRating.style.display = 'none';  
    }
});

// Event listener for clearing the rating
removeRating.addEventListener('click', () => {
    currentRating = 0;  // Reset the rating
    updateStarColor(currentRating);

    // Remove the rating from the database
    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,
            action: 'removeRate',
            rating: currentRating
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rating removed successfully', data);
    })
    .catch(error => {
        console.error('Error removing rating: ', error);
    });

    removeRating.style.display = 'none';  // Hide the "X" button after removing the rating
});

// Function to update the star colors based on the rating
function updateStarColor(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('selected');  // Add the selected class for filled stars
        } else {
            star.classList.remove('selected');  // Remove the selected class for empty stars
        }
    });
}
