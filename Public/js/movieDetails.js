const castDetails = document.getElementById('CastDetails');
const cast = document.getElementById('Cast');

const crewDetails = document.getElementById('CrewDetails');
const crew = document.getElementById('Crew');

const genreDetails = document.getElementById('genreDetails');
const genre = document.getElementById('Genre');

function showCast() {
    castDetails.style.display = 'flex';
    crewDetails.style.display = 'none';
    genreDetails.style.display = 'none';
}

function showCrew() {
    crewDetails.style.display = 'flex';
    castDetails.style.display = 'none';
    genreDetails.style.display = 'none';
}

function showGenre() {
    genreDetails.style.display = 'flex';
    crewDetails.style.display = 'none';
    castDetails.style.display = 'none';
}

