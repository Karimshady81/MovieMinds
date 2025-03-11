const logOutBtn = document.getElementById('logOutBtn')

if (logOutBtn){
    logOutBtn.addEventListener('click', async () => {
    try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:'include',
            });

            if (response.ok){
                window.location.href = '/';
            }
        }
        catch (error) {
            console.error("Error logging Out: ",error);
        }
    })
}