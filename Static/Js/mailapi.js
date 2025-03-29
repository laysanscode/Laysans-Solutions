function sendEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.querySelector('textarea[name="message"]').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
        alert("All fields are required.");
        return;
    }

    // Prepare the data to be sent
    const data = { name, email, subject, message };

    // Send the request to the backend
    fetch('https://laysans-solutions-api.onrender.com/mail/', {  // Adjust the URL to your backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token if CSRF protection is enabled
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        const responseMessage = document.getElementById('responseMessage');
        if (!response.ok) {
            // If the response is not ok, throw an error
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.className = 'alert alert-success text-center justify-content-center p-3'; // Set success class
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.message}`;  // Add success icon
        responseMessage.style.display = 'block';  // Show the response message

        // Hide the message after 10 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 10000);
    })
    .catch(error => {
        console.error('Error:', error);
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.className = 'alert alert-danger text-center justify-content-center p-3'; // Set error class
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> An error occurred: ${error.message}`; // Add error icon
        responseMessage.style.display = 'block';  // Show the error message

        // Hide the message after 10 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 10000);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}