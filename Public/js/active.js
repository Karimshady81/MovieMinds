// Select all the links in the detailLinks
const detailLinks = document.querySelectorAll('.detailLinks a');

// Add click event to each link
detailLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class from all links
        detailLinks.forEach(link => link.classList.remove('active'));
        
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});
