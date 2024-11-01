const profileBtn = document.getElementById('profile');
const editProfile = document.getElementById('profileDetails');
const avatarBtn = document.getElementById('avatar');
const editAvatar = document.getElementById('avatarDetails');
const authBtn = document.getElementById('auth');
const authDetails = document.getElementById('passwordDetails');
const saveBtn = document.getElementById('saveBTN');
const saveAvatar = document.getElementById('saveAvatar');
const savePassword = document.getElementById('savePassword');

profileBtn.addEventListener("click", () => {
    editProfile.style.display = "block";
    editAvatar.style.display = "none";
    authDetails.style.display = "none";
});

avatarBtn.addEventListener("click", () => {
    editProfile.style.display = "none";
    editAvatar.style.display = "block";
    authDetails.style.display = "none";
});

authBtn.addEventListener("click", () => {
    editProfile.style.display = "none";
    editAvatar.style.display = "none";
    authDetails.style.display = "block";
});

saveAvatar.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(document.getElementById('editProfileForm'));

    fetch('/saveProfile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // Display success message
            const messageElement = document.createElement('div');
            messageElement.style.color = 'white';
            messageElement.style.padding = '10px';
            messageElement.style.borderRadius = '5px';
            messageElement.style.marginTop = '10px';
            messageElement.style.backgroundColor = 'green';
            messageElement.innerText = data.message;
            document.getElementById('editProfileForm').prepend(messageElement);

            // Update avatar image if provided
            if (data.avatar) {
                editAvatar.src = data.avatar; // Assuming avatarImg is your <img> element’s id
            }

            // Optionally remove message after a few seconds
            setTimeout(() => messageElement.remove(), 3000);
        }
    })
    .catch(error => console.error('Error saving profile details:', error));
});


saveBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const givenName = document.getElementById('givenName').value;
    const familyName = document.getElementById('familyName').value;
    const location = document.getElementById('location').value;
    const bio = document.getElementById('bio').value;
  
    fetch('/saveProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        givenName,
        familyName, 
        location, 
        bio})
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
            // Update the DOM to show a success message
            const messageElement = document.createElement('div');
            messageElement.style.color = 'white';
            messageElement.style.padding = '10px';
            messageElement.style.borderRadius = '5px';
            messageElement.style.marginTop = '10px';
            messageElement.style.backgroundColor = 'green';
            messageElement.innerText = data.message;
            editProfile.prepend(messageElement);

            // clear the message after a few seconds
            setTimeout(() => {
            messageElement.remove();
            }, 3000);

        }
      })
      .catch(error => console.error('Error saving profile details:', error));
});


savePassword.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    fetch('/saveProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.createElement('div');
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.marginTop = '10px';

        if (data.success) {
            // Success message
            messageElement.innerText = data.message || 'Password changed successfully';
            messageElement.style.backgroundColor = 'green';
        } else {
            // Error message for failed password update
            messageElement.innerText = data.message || 'Failed to change password';
            messageElement.style.backgroundColor = 'red';
        }

        // Append the message to the page
        authDetails.prepend(messageElement);

        // Clear the message after a few seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    })
    .catch(error => {
        console.error('Error changing password', error);
    });
});





  



