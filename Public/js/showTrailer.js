var modal = document.getElementById('trailerModal');
var closeButton = document.getElementsByClassName("closeTrailer")[0];
var videoPlayer = document.getElementById('videoPlayer');

function displayTrailer() {
    modal.style.display = "block";
}

closeButton.onclick = () => {
    modal.style.display = "none";
    stopVideo();
}

function stopVideo() {
    videoPlayer.src = videoPlayer.src
}
 
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        stopVideo();
    }
}