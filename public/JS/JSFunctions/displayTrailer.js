//This is done this way to be able to access the other elements from another JS we have a dispatchEvent "trailerReady" to tell us that the elements exist in the DOM
document.addEventListener('trailerReady', () => {
    const trailerModal = document.getElementById('trailerModal');
    const closeButton = document.querySelector('.close-Trailer');
    const videoPlayer = document.getElementById('videoPlayer');

    function displayTrailer() {
        trailerModal.style.display = 'block';
    }

    function stopVideo() {
        videoPlayer.src = videoPlayer.src; // Reset the video
    }

    closeButton.onclick = () => {
        trailerModal.style.display = 'none';
        stopVideo();
    };

    window.onclick = (event) => {
        if (event.target === trailerModal) {
            trailerModal.style.display = 'none';
            stopVideo();
        }
    };

    // Attach the function to the global scope
    window.displayTrailer = displayTrailer;
});
