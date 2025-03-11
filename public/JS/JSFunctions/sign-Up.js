var signupModal = document.getElementById('signUpModal');
var closeSignUp = document.querySelector('.close-Signup');

function displaySignUpModal(){
    signupModal.style.display = 'flex'; 
}

closeSignUp.onclick = () => {
    signupModal.style.display = 'none';
}

window.onclick = (event) => {
    if (event.target === signupModal){
        signupModal.style.display = 'none';
    }
};