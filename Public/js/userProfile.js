document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = '0724dc82124e10da3fea3a23a5ce17ee';
    const likedElements = document.querySelectorAll('.movieCard');
    const watchList = document.querySelectorAll('.movieCard ');
    const reviewedElements = document.querySelectorAll('.reviewItem');
  
    likedElements.forEach(async (element) => {
      const movieID = element.getAttribute('data-movie-id');

      // Fetch movie details 
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
      const movieData = await response.json();
  
      // Dynamically update the content inside the anchor tag
      const movieCard = element.querySelector('a');
      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieData.title}">
        <p>${movieData.title}</p>
      `;
    });

    watchList.forEach(async (element) => {
      const movieID = element.getAttribute('data-movie-id');

      //Fetch movie Details
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
      const movieData = await response.json();

       // Dynamically update the content inside the anchor tag
       const movieCard = element.querySelector('a');
       movieCard.innerHTML = `
         <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieData.title}">
         <p>${movieData.title}</p>
       `;
    })

    reviewedElements.forEach(async (element) => {
      const movieID = element.getAttribute('data-movie-id');
      console.log(movieID);
      
      try {
         const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
         const movieData = await response.json();
         
         const reviewItemImg = element.querySelector('a');
         const reviewItemDetails = element.querySelector('.movieTitle');

         reviewItemImg.innerHTML = `
            <div class="reviewImage">
               <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieData.title}">
            </div>
         `;

         reviewItemDetails.textContent = `
            ${movieData.title} (${movieData.release_date.slice(0, 4)})
         `
      } catch (error) {
         console.error('Error fetching movie details:', error);
      }
   });   
});
  