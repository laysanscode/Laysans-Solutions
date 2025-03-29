function sendEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const jobName = document.getElementById('jobNameInput').value.trim(); // Get the job name from the input
    const resume = document.getElementById('resume').files[0]; // Get the file object
    const message = document.getElementById('message').value.trim(); // Get the message from the textarea

    // Basic validation
    if (!name || !email || !jobName || !resume || !message) {
        alert("All fields are required.");
        return;
    }

    // Prepare the data to be sent
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('JobName', jobName);
    formData.append('resume', resume);
    formData.append('message', message);

    // Send the request to the backend
    fetch('https://laysans-solutions-api.onrender.com/careermail/', {  // Adjust the URL to your backend endpoint
        method: 'POST',
        body: formData // Send the FormData object
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.innerText = data.message;  // Assuming your backend returns a message
        responseMessage.style.display = 'block';  // Show the response message

        // Hide the message after 10 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 10000);
    })
    .catch(error => {
        console.error('Error:', error);
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.innerText = 'An error occurred: ' + error.message;
        responseMessage.style.display = 'block';  // Show the error message
    });
}