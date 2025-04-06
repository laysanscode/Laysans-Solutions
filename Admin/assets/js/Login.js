document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('https://laysans-solutions-api.onrender.com/Login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store tokens in localStorage or sessionStorage
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('accessToken', data.access);

                // Redirect to the dashboard
                window.location.href = '../../Admin/dashboard/index.html'; // Update with your dashboard URL
            } else {
                // Display error notification
                showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An unexpected error occurred. Please try again.', 'error');
        }
    });

    function showNotification(message, type) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;

        // Append the notification to the body
        document.body.appendChild(notification);

        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});