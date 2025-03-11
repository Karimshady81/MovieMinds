var signinSection = document.getElementById('signIn');
var closeSignInSection = document.querySelector('.close-Sign-In');
var navSection = document.getElementById('navSection');

function displaySignInSection(){
    signinSection.style.display = 'block';
    navSection.style.display = 'none';
}

closeSignInSection.onclick = () => {
    signinSection.style.display = 'none';
    navSection.style.display = 'flex';
}