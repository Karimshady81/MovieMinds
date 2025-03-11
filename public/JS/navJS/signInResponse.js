document.getElementById("signIpForm").addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById("signInUsername").value;
    const password = document.getElementById("signInPassword").value;
    const errorMessage = document.querySelector(".error-Message");

    try {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        const result = await response.json();

        if (response.ok) {
            window.location.reload()
        }
        else {
            //Display error message if there was an error
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = result.message;
        }
    }
    catch (error) {
        console.error("Error logging In: ",error);
    }
})