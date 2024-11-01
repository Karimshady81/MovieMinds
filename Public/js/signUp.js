var signupModal = document.getElementById('signupModal');
var closeSignUp = document.querySelector('.closeSignup');

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

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Handle success, maybe redirect or display a message
            window.location.href = '/'; // Redirect to home page or other appropriate page
        } else {
            // Display error message
            document.getElementById('signupError').innerText = result.message;
        }
    } catch (error) {
        console.error('Error signing up:', error);
        document.getElementById('signupError').innerText = 'An unexpected error occurred.';
    }
});
