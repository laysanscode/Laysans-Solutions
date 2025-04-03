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
function createLoadingPlaceholders(count) {
    const tableBody = document.getElementById('jobTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    for (let i = 0; i < count; i++) {
        const placeholderRow = document.createElement('tr');
        placeholderRow.innerHTML = `
            <td class="placeholder" style="width: 150px;"></td>
            <td class="placeholder" style="width: 100px;"></td>
            <td class="placeholder" style="width: 150px;"></td>
            <td class="placeholder" style="width: 50px;"></td>
            <td>
                <button class="btn btn-warning btn-sm" disabled>Update</button>
                <button class="btn btn-danger btn-sm" disabled>Delete</button>
            </td>
        `;
        tableBody.appendChild(placeholderRow);
    }
}

// Function to fetch job data (GET)
async function fetchJobs() {
    createLoadingPlaceholders(6); // Show 6 placeholders while loading

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/career/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

// Function to display jobs in the HTML table
function displayJobs(jobs) {
    const tableBody = document.getElementById('jobTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    jobs.forEach(job => {
        const jobRow = document.createElement('tr');
        jobRow.innerHTML = `
            <td>${job.JobName}</td>
            <td>${job.RoleName}</td>
            <td>${job.Iconclassname}</td>
            <td>${job.exp}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openUpdateModal(${job.id})">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(jobRow);
    });
}

// Function to update a job (PUT)
async function updateJob(id) {
    const updatedJob = {
        // Include the updated job data here
        JobName: 'Updated Job Name', // Example data
        RoleName: 'Updated Role Name',
        Iconclassname: 'updated-icon-class',
        exp: 5 // Example data
    };

    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/career/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedJob),
        });

        if (!response.ok) {
            throw new Error('Failed to update job');
        }

        const result = await response.json();
        console.log('Job updated:', result);
        fetchJobs(); // Refresh the list after update
    } catch (error) {
        console.error('Error updating job:', error);
    }
}

// Function to delete a job (DELETE)
async function deleteJob(id) {
    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/career/${id}/`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete job');
        }

        console.log('Job deleted:', id);
        fetchJobs(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting job:', error);
    }
}

// Function to open a modal for updating a job (you need to implement this)
function openUpdateModal(id) {
    // Logic to open a modal and populate it with the job data for editing
    console.log('Open update modal for job ID:', id);
}

// Fetch jobs when the page loads
window.onload = fetchJobs;