async function fetchCareers() {
    try {
        const response = await fetch('http://127.0.0.1:8000/career/'); // Adjust the URL to your API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const careers = await response.json();
        displayCareers(careers);
    } catch (error) {
        console.error('Error fetching careers:', error);
    }
}

// Function to display careers in the HTML
function displayCareers(careers) {
    const careerList = document.getElementById('careerList');
    careerList.innerHTML = ''; // Clear existing content

    careers.forEach(career => {
        const careerItem = document.createElement('div');
        careerItem.className = 'col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch custom-shadow justify-content-center';
        careerItem.innerHTML = `
            <div class="icon-box d-flex flex-column align-items-center text-center pb-3">
                <div class="icon"><i class="fa-solid fa-code"></i></div>
                <h4>
                    <a href="careerform.html?id=${career.id}&name=${encodeURIComponent(career.JobName)}">
                        ${career.JobName}
                    </a>
                </h4>
                <p><strong>Role:</strong> ${career.RoleName}</p>
                <p><strong>Exp:</strong> ${career.exp} Yrs</p>
                <p>${career.Aboutjob}</p>
                <button type="button" class="btn btn-danger" onclick="redirectToForm(${career.id}, '${career.JobName}', '${career.RoleName}', ${career.exp}, '${career.Aboutjob}')">Apply Now</button>
            </div>
        `;
        careerList.appendChild(careerItem);
    });
}

// Function to redirect to the career form and store data
function redirectToForm(id, jobName, roleName, exp, aboutJob) {
    console.log('RedirectToForm called with:', id, jobName, roleName, exp, aboutJob);
    
    const careerData = {
        id: id,
        jobName: jobName,
        roleName: roleName,
        exp: exp,
        aboutJob: aboutJob
    };
    localStorage.setItem('careerData', JSON.stringify(careerData));

    alert(`Redirecting to career form with ID: ${id}`); // Debugging alert

    window.location.href = `careerform.html?id=${id}&name=${encodeURIComponent(jobName)}`;
}

// Fetch careers when the page loads
window.onload = fetchCareers;