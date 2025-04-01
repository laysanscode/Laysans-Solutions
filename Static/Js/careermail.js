function sendEmail(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form elements
    const form = document.getElementById('careerForm'); // Ensure form has this ID
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const jobNameInput = document.getElementById('jobNameInput');
    const resumeInput = document.getElementById('resume');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');
    const responseMessage = document.getElementById('responseMessage');

    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const jobName = jobNameInput.value.trim();
    const resume = resumeInput.files[0];
    const message = messageInput.value.trim();

    // Validation check
    if (!name || !email || !jobName || !resume || !message) {
        alert("All fields are required.");
        return;
    }

    // Disable button & show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Submitting...`;

    // Prepare the data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('JobName', jobName);
    formData.append('resume', resume);
    formData.append('message', message);

    // Send request to backend
    fetch('https://laysans-solutions-api.onrender.com/careermail/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        responseMessage.innerText = data.message || "Your application has been submitted successfully!";
        responseMessage.className = "alert alert-success";
        responseMessage.style.display = 'block';

        // Reset form fields after 2 seconds
        setTimeout(() => {
            form.reset(); // Reset text inputs

            // Manually clear the file input (since form.reset() doesn't clear file inputs)
            resumeInput.value = '';
            responseMessage.style.display = 'none';
        }, 2000);
    })
    .catch(error => {
        // Show error message
        console.error('Error:', error);
        responseMessage.innerText = 'An error occurred: ' + error.message;
        responseMessage.className = "alert alert-danger";
        responseMessage.style.display = 'block';
    })
    .finally(() => {
        // Re-enable submit button after response
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = "Submit Application";
        }, 2000);
    });
}
