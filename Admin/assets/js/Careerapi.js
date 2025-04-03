function sendcareer(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form elements
    const form = document.getElementById('contactForm'); // Ensure your form has this ID
    const JobNameinput = document.getElementById('JobName');
    const RoleNameinput = document.getElementById('RoleName');
    const Iconclassnameinput = document.getElementById('Iconclassname');
    const expinput = document.getElementById('exp');
    const Aboutjobinput= document.querySelector('textarea[name="message"]');
    const submitButton = document.getElementById('submitButton');
    const responseMessage = document.getElementById('responseMessage');

    // Get values
    const JobName = JobNameinput.value.trim();
    const RoleName = RoleNameinput.value.trim();
    const Iconclassname = Iconclassnameinput.value.trim();
    const exp=expinput.value.trim();
    const Aboutjob = Aboutjobinput.value.trim();

    // Basic validation
    if (!JobName || !RoleName || !Iconclassname ||!exp|| !Aboutjob) {
        alert("All fields are required.");
        return;
    }

    // Disable submit button & show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Sending...`;

    // Prepare data
    const data = { JobName, RoleName, Iconclassname, exp,Aboutjob };

    // Send request
    fetch('https://laysans-solutions-api.onrender.com/career/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token if CSRF protection is enabled
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        responseMessage.className = 'alert alert-success text-center p-3';
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.message || "Your message has been sent successfully!"}`;
        responseMessage.style.display = 'block';

        // Reset form after 2 seconds
        setTimeout(() => {
            form.reset();
            responseMessage.style.display = 'none';
        }, 2000);
    })
    .catch(error => {
        // Show error message
        console.error('Error:', error);
        responseMessage.className = 'alert alert-danger text-center p-3';
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> An error occurred: ${error.message}`;
        responseMessage.style.display = 'block';

        // Hide message after 10 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 10000);
    })
    .finally(() => {
        // Re-enable submit button after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = "Send Message";
        }, 2000);
    });
}

// Function to get CSRF token (if needed)
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
