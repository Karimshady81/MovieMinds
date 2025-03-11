document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const email = document.getElementById('signUpEmail').value;
    const errorDiv = document.getElementById('signUpError'); // Reference to error display div

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const result = await response.json(); // Parse the JSON response

        if (response.ok) {
            // console.log(result);
            errorDiv.style.color = 'green';  //Show success message
            errorDiv.innerHTML = 'Signup successful! Redirecting...';

            setTimeout(() => {
                window.location.href = '/'; //Redirect after a delay 
            }, 2000);
        } else {
            // console.error(result.message);
            errorDiv.style.color = 'red'; //Display the error message in red
            errorDiv.innerHTML = result.message;
        }
    } catch (error) {
        console.error('Error', error);
        errorDiv.style.color = 'red';
        errorDiv.innerHTML = 'An error occurred. Please try again later.';
    }
});
