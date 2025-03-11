document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Hide all tab panels
            panels.forEach(panel => panel.classList.remove("active"));

            // Show the corresponding panel
            const target = tab.getAttribute("data-tab");
            document.getElementById(target).classList.add("active");
        });
    });

    fetch('/editProfile')
        .then((response) => response.json())
        .then((data) => {
            const userData = data.user;
            
            if (!userData) {
                console.error('User Data is missing');
                return window.location.href = '/';
            }

            // console.log(userData);

            //Section for displaying the edit profile form
            const editFormContainer = document.getElementById('editProfile')
            if (!editFormContainer) {
                console.error('Edit Profile Form is missing');
                return;
            }
            editFormContainer.innerHTML = `
                    <h2>Edit Profile</h2>
                    <form id="profileForm">
                        <h3 id="messageResponse" style="color: hsl(36, 80%, 58%);"></h3>
                        <label>Username</label>
                        <input type="text" id="username" value="${userData.username}" readonly>  
                        
                        <label>Given Name</label>
                        <input type="text" id="givenName" value="${userData.givenName || ''}">
                        
                        <label>Family Name</label>
                        <input type="text" id="familyName" value="${userData.familyName || ''}">
                        
                        <label>Email</label>
                        <input type="email" id="email" value="${userData.email}" readonly>
                        
                        <label>Location</label>
                        <input type="text" id="location" value="${userData.location || ''}">
                        
                        <label>Bio</label>
                        <textarea id="bio" name="bio">${userData.bio || ''}</textarea>
                        
                        <button type="submit">Save Changes</button>
                    </form>
            `;

            //Handling the form submission
            document.getElementById('profileForm').addEventListener("submit", (event) => {
                event.preventDefault();

                const messageResponse = document.getElementById("messageResponse");

                const formData = {
                    givenName: document.getElementById("givenName").value,
                    familyName: document.getElementById("familyName").value,
                    location: document.getElementById("location").value,
                    bio: document.getElementById("bio").value
                }

                // console.log(formData)

                fetch('/editProfile', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    messageResponse.innerHTML = data.message;
                })
                .catch(error => {
                    console.error("Error updating profile: ",error);
                })
            })

            //Section for handling the avatar 
            const avatarForm = document.getElementById("avatarForm")
        
            if (avatarForm) {
                avatarForm.innerHTML = `
                    <h3 id="avatarMessageRes" style="color: hsl(36, 80%, 58%);"></h3>
                    <h2>Change Avatar</h2>
                    <input type="file" id="avatar" name="avatar" accept="image/*">
                    <button type="submit" >Upload</button>
                `

                avatarForm.addEventListener("submit", async (event) => {
                    event.preventDefault();

                    const messageResponse = document.getElementById("avatarMessageRes");

                    const formData = new FormData(avatarForm);
                    try{
                        const response = await fetch('/uploadAvatar', {
                            method: 'POST',
                            body: formData,
                        });

                        const data = await response.json();
                        console.log(data);
                        if (data.message) {
                            messageResponse.innerHTML = data.message;
                        }
                    }
                    catch(error){
                        console.error("Error updating avatar: ",error);
                    }
                })
            }

            //Section for changing the password field
            const passwordForm = document.getElementById("changePassword")
            passwordForm.innerHTML =`
                <h2>Change Password</h2>
                <form id="passwordForm">
                    <h3 id="passMessageRes" style="color: hsl(36, 80%, 58%);"></h3>

                    <label for="password">Current password</label>
                    <input type="password" name="currentPassword" id="currentPassword">
                    
                    <label for="newPassword">New password</label>
                    <input type="password" name="newPassword" id="newPassword">
                    
                    <label for="confirmPassword">Confirm password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword">
                    
                    <button type="submit">Save Changes</button> 
                </form>
            `;

            //Section to handle the submission
            document.getElementById('passwordForm').addEventListener("submit", (event) => {
                event.preventDefault();

                const messageResponse = document.getElementById('passMessageRes');
                const formData = {
                    currentPassword: document.getElementById('currentPassword').value,
                    newPassword: document.getElementById('newPassword').value,
                    confirmPassword: document.getElementById('confirmPassword').value
                }
                
                fetch('/changePassword', {
                    method: 'POST',
                    headers:{
                        "Content-Type": "Application/Json",
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    messageResponse.innerHTML = data.message;
                })
                .catch(error => console.error("Error changing password",error))
            })


        })
        .catch((error) => {
            console.error("Error updating data: ",error);
        });

});
