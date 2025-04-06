document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const responsesDiv = document.querySelector('.responses'); // Get the responses div
    
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            showNotification('Please enter both email and password.', 'danger');
            return;
        }

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
                window.location.href = '../../dashboard/index.html'; // Update with your dashboard URL
            } else {
                // Display error notification
                showNotification(data.error || 'Login failed. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An unexpected error occurred. Please try again.', 'danger');
        }
    });

    function showNotification(message, type) {
        // Create a notification element with Bootstrap classes
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.role = 'alert';
        notification.innerHTML = `
            ${message}
        `;

        // Append the notification to the responses div
        responsesDiv.appendChild(notification);

        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            $(notification).alert('close'); // Use jQuery to close the alert
        }, 3000);
    }
});