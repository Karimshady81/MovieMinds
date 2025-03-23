//This is done this way to be able to access the other elements from another JS we have a dispatchEvent "trailerReady" to tell us that the elements exist in the DOM
// Define globally
function displayTrailer() {
    const trailerModal = document.getElementById('trailerModal');
    if (trailerModal) trailerModal.style.display = 'block';
  }
  
  // Register globally
  window.displayTrailer = displayTrailer;
  
  // Define video handling AFTER trailer is loaded
  document.addEventListener('trailerReady', () => {
    const closeButton = document.querySelector('.close-Trailer');
    const trailerModal = document.getElementById('trailerModal');
    const videoPlayer = document.getElementById('videoPlayer');
  
    function stopVideo() {
      if (videoPlayer) videoPlayer.src = videoPlayer.src;
    }
  
    if (closeButton) {
      closeButton.onclick = () => {
        trailerModal.style.display = 'none';
        stopVideo();
      };
    }
  
    window.onclick = (event) => {
      if (event.target === trailerModal) {
        trailerModal.style.display = 'none';
        stopVideo();
      }
    };
  });
  
