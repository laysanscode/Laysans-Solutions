// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch job data for editing (GET)
async function fetchJobForUpdate() {
    const jobId = getUrlParameter('id'); // Get the job ID from the URL
    if (!jobId) {
        console.error('No job ID provided in the URL');
        return;
    }

    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/career/${jobId}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const job = await response.json();
        console.log('Fetched job data:', job); // Log the fetched job data
        populateUpdateForm(job); // Populate the form with job data
    } catch (error) {
        console.error('Error fetching job data:', error);
    }
}

// Function to populate the update form with job data
function populateUpdateForm(job) {
    console.log('Populating form with job data:', job); // Log the job data being populated
    document.getElementById('jobId').value = job.id; // Set the job ID
    document.getElementById('JobName').value = job.JobName || ''; // Use empty string if undefined
    document.getElementById('RoleName').value = job.RoleName || ''; // Use empty string if undefined
    document.getElementById('Iconclassname').value = job.Iconclassname || ''; // Use empty string if undefined
    document.getElementById('exp').value = job.exp || ''; // Use empty string if undefined
    document.getElementById('Aboutjob').value = job.Aboutjob || ''; // Use empty string if undefined
}

// Function to send career data (PUT)
async function sendcareer(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form elements
    const form = document.getElementById('contactForm');
    const JobNameinput = document.getElementById('JobName');
    const RoleNameinput = document.getElementById('RoleName');
    const Iconclassnameinput = document.getElementById('Iconclassname');
    const expinput = document.getElementById('exp');
    const Aboutjobinput = document.getElementById('Aboutjob');
    const responseMessage = document.getElementById('responseMessage');
    const jobId = document.getElementById('jobId').value; // Hidden input for job ID

    // Prepare data
    const data = {
        JobName: JobNameinput.value.trim(),
        RoleName: RoleNameinput.value.trim(),
        Iconclassname: Iconclassnameinput.value.trim(),
        exp: expinput.value.trim(),
        Aboutjob: Aboutjobinput.value.trim()
    };

    // Send request
    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/career/${jobId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        responseMessage.className = 'alert alert-success text-center p-3';
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${result.message || "Job updated successfully!"}`;
        responseMessage.style.display = 'block';

        // Reset form after 2 seconds
        setTimeout(() => {
            form.reset();
            responseMessage.style.display = 'none';
            window.location.href = 'path/to/your/job/list/page.html'; // Redirect to job list page
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        responseMessage.className = 'alert alert-danger text-center p-3';
        responseMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> An error occurred: ${error.message}`;
        responseMessage.style.display = 'block';

        // Hide message after 10 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 10000);
    }
}

// Call the fetch function when the page loads
window.onload = fetchJobForUpdate;