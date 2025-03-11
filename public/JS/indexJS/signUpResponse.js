document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const email = document.getElementById('signUpEmail').value;

    try{
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
        
        const result = await response.json(); //Parse the JSON response 

        if (response.ok){
            console.log(result)
            window.location.href = '/'; //Redirect to the index page
        }
        else {
            console.error(result.message); //Handle the error
            document.getElementById('signUpError').innerHTML = result.message 
        }
    }
    catch (error) {
        console.error('Error',error);
    }
})