document.addEventListener("DOMContentLoaded", () => {
    fetch('/total-films')
        .then((response) => response.json())
        .then((data) => {
            const totalMovies = data.total;
            const totalMoviesItem = document.getElementById('totalMovies')
            totalMoviesItem.innerHTML = `
                <p> There are ${totalMovies.toLocaleString()} Films available </p>
            `;
        })
        .catch((error) => {
            console.error("Error fetching movies: ",error);
        })

});