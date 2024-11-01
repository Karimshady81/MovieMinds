// Get the modal and the open/close elements
const reviewLogBtn = document.getElementById('reviewLog');
const reviewFormModal = document.getElementById('reviewFormModal');
const closeModalBtn = document.querySelector('.close');
const reviewLog = document.getElementById('reviewLog');
const textarea = document.getElementById('reviewTextarea');
const saveBtn = document.getElementById('saveReview');
const deleteBtn = document.getElementById('deleteReview');

// Function to show the modal
reviewLogBtn.addEventListener('click', () => {
    reviewFormModal.classList.add('show'); // Add the 'show' class to make it visible
});

// Function to close the modal
closeModalBtn.addEventListener('click', () => {
    reviewFormModal.classList.remove('show'); // Remove the 'show' class to hide it
});

// Close modal if clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === reviewFormModal) {
        reviewFormModal.classList.remove('show'); // Hide modal
        textarea.value = ''; //Clear
    }
});

// Add an input event listener to adjust the height as the user types
textarea.addEventListener('input', function () {
    this.style.height = 'auto'; // Reset height to auto
    this.style.height = (this.scrollHeight) + 'px'; // Set the height to match the scrollHeight
});

saveBtn.addEventListener('click', function() {
    const movieID = document.getElementById('movieID').value; // Check if movieID exists and is correct
    const reviewText = document.getElementById('reviewTextarea').value;

    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,
            review: reviewText,
            action: 'reviewed'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Bad request: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Action saved successfully:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    reviewLog.innerHTML = 'Edit your review...'; //Change the review button to edit 
    reviewFormModal.classList.remove('show'); // Hide modal
});

//Deleting the review
deleteBtn.addEventListener('click', function() {
    const movieID = document.getElementById('movieID').value; // Check if movieID exists and is correct
    const reviewText = textarea.value = '';

    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,
            review: reviewText,
            action: 'removeReview',
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('action saved successfully', data);
    })
    .catch(error => {
        console.error('error saving action', error);
    })
})



function toggleWatched() {
    // Get the "Watch" button
    const watchBtn = document.getElementById('watchBtn');

    // Change the button content to "Watched"
    watchBtn.id = 'watchedBtn';
    watchBtn.innerHTML = '<i class="fa fa-eye"></i> Watched';

    // Change the button style to indicate "Watched"
    watchBtn.style.color = 'hsl(36, 80%, 58%)';

    // Change the onclick event to removeWatched (if the user wants to unmark it)
    watchBtn.onclick = removeWatched;

    // Save the watched action in the database (AJAX request)
    const movieID = document.getElementById('movieID').value;
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
}

function removeWatched() {
    // Get the "Watched" button
    const watchedBtn = document.getElementById('watchedBtn');

    // Change the button content back to "Watch"
    watchedBtn.id = 'watchBtn';
    watchedBtn.innerHTML = '<i class="fa fa-eye"></i> Watch';

    // Change the button style to indicate "Watch"
    watchedBtn.style.backgroundColor = '';
    watchedBtn.style.color = '';  // Reset to default

    // Change the onclick event to toggleWatched again
    watchedBtn.onclick = toggleWatched;

    // Remove the watched action in the database (AJAX request)
    const movieID = document.getElementById('movieID').value;
    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,
            action: 'removeWatched'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Watched action removed successfully', data);
    })
    .catch(error => {
        console.error('Error removing watched action:', error);
    });
}

function toggleLiked () {
    //Get the "like" button
    const likeBtn = document.getElementById('likeBtn')

    //Change the button content to Liked
    likeBtn.classList.add('liked');
    likeBtn.id = 'likedBtn';
    likeBtn.innerHTML = '<i class="fa fa-heart"></i> Liked';

    // Change the button style to indicate "Liked"
    likeBtn.style.color = 'hsl(36, 80%, 58%)';

    // Change the onclick event to removeLiked (if the user wants to unmark it)
    likeBtn.onclick = removeLiked;

    //Save the action to DB using AJAX request
    const movieID = document.getElementById('movieID').value; // Get movieID
    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,  // Include the movieID
            action: 'liked'  // Action should be 'liked'
        })
    })
    .then(response => {
        if (!response.ok) {  // Check if the response status is not 200
            throw new Error('Failed to save liked action');
        }
        return response.json();  // Parse the JSON from the response
    })
    .then(data => {
        console.log('liked action saved successfully', data);
    })
    .catch(error => {
        console.error('Error in fetch:', error.message);  // Log a meaningful error message
    });
}

function removeLiked () {
     // Get the "Liked" button
     const likedBtn = document.getElementById('likedBtn');

     // Change the button content back to "Like"
     likedBtn.classList.remove('liked');
     likedBtn.id = 'likeBtn';
     likedBtn.innerHTML = '<i class="fa fa-heart"></i> Like';
 
     // Change the button style to indicate "Like"
     likedBtn.style.backgroundColor = '';
     likedBtn.style.color = '';  // Reset to default
 
     // Change the onclick event to toggleLiked again
     likedBtn.onclick = toggleLiked;
 
     // Remove the liked action in the database (AJAX request)
     const movieID = document.getElementById('movieID').value;
     fetch('/saveRating', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             movieID: movieID,
             action: 'removeLike'
         })
     })
     .then(response => response.json())
     .then(data => {
         console.log('Watched action removed successfully', data);
     })
     .catch(error => {
         console.error('Error removing watched action:', error);
     });
}

function toggleAddedList() {
    //Get the watchList button
    const watchListBtn = document.getElementById('watchlistBtn');

    //Change the watchList content to "Added TO LIST"
    watchListBtn.id = 'watchedlistBtn';
    watchListBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #63E6BE;"></i> Watchlist';

    // Change the onclick event to removeWatchList (if the user wants to unmark it)
    watchListBtn.onclick = removeAddedList;

    //Save the action to DB using AJAX request
    const movieID = document.getElementById('movieID').value; // Get movieID
    fetch('/saveRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movieID: movieID,  // Include the movieID
            action: 'watchlist'  // Action should be 'watched'
        })
    })
    .then(response => {
        if (!response.ok) {  // Check if the response status is not 200
            throw new Error('Failed to save watchlist action');
        }
        return response.json();  // Parse the JSON from the response
    })
    .then(data => {
        console.log('watchlist action saved successfully', data);
    })
    .catch(error => {
        console.error('Error in fetch:', error.message);  // Log a meaningful error message
    });
}

function removeAddedList() {
      // Get the "watchedList" button
      const watchedListBtn = document.getElementById('watchedlistBtn');

      // Change the button content back to "watchlist"
      watchedListBtn.id = 'watchlistBtn';
      watchedListBtn.style.color = '';
      watchedListBtn.innerHTML = '<i class="fa fa-plus"></i> Watchlist';
  
      // Change the onclick event to addToList again
      watchedListBtn.onclick = toggleAddedList;
  
      // Remove the watchList action in the database (AJAX request)
      const movieID = document.getElementById('movieID').value;
      fetch('/saveRating', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              movieID: movieID,
              action: 'removeWatchList'
          })
      })
      .then(response => response.json())
      .then(data => {
          console.log('Watched action removed successfully', data);
      })
      .catch(error => {
          console.error('Error removing watched action:', error);
      });
}

