// Function to create and display loading placeholders
function createLoadingPlaceholders(count) {
    const careerList = document.getElementById('careerList');
    careerList.innerHTML = ''; // Clear existing content

    for (let i = 0; i < count; i++) {
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch justify-content-center mb-4';
        placeholderItem.innerHTML = `
            <div class="icon-box d-flex flex-column align-items-center text-center pb-3 border rounded shadow-sm" style="background-color: #f8f9fa;">
                <div class="placeholder-icon" style="width: 60px; height: 60px; background-color: #e0e0e0; border-radius: 50%; margin-bottom: 15px;"></div>
                <h4>
                    <span class="placeholder-text" style="display: inline-block; width: 90%; height: 24px; background-color: #e0e0e0; border-radius: 4px;"></span>
                </h4>
                <p><strong>Role:</strong> <span class="placeholder-text" style="display: inline-block; width: 70%; height: 18px; background-color: #e0e0e0; border-radius: 4px;"></span></p>
                <p><strong>Exp:</strong> <span class="placeholder-text" style="display: inline-block; width: 50%; height: 18px; background-color: #e0e0e0; border-radius: 4px;"></span></p>
                <p><span class="placeholder-text" style="display: inline-block; width: 100%; height: 18px; background-color: #e0e0e0; border-radius: 4px;"></span></p>
                <a type="button" class="btn btn-danger" style="pointer-events: none; opacity: 0.5; width: 100%;">Apply Now</a>
            </div>
        `;
        careerList.appendChild(placeholderItem);
    }
}

// Function to fetch careers
async function fetchCareers() {
    createLoadingPlaceholders(6); // Show 6 placeholders while loading

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/career/');
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
                <a type="button" class="btn btn-danger" href="careerform.html?id=${career.id}&name=${encodeURIComponent(career.JobName)}">Apply Now</a>
            </div>
        `;
        careerList.appendChild(careerItem);
    });
}

// Fetch careers when the page loads
window.onload = fetchCareers;