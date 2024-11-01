var signinSection = document.getElementById('signIN');
var closeSignInSection = document.querySelector('.closeSignin');
var navSection = document.getElementById('navSection');

function displaySignInSection(){
    signinSection.style.display = 'block';
    navSection.style.display = 'none';
}

closeSignInSection.onclick = () => {
    signinSection.style.display = 'none';
    navSection.style.display = 'flex';
}