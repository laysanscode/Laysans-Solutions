 
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
async function fetchmail() {
    createLoadingPlaceholders(6); // Show 6 placeholders while loading

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/mailinbox/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const mail = await response.json();
        displaymail(mail);
    } catch (error) {
        console.error('Error fetching mail:', error);
    }
}

// Function to display mail in the HTML table
function displaymail(mail) {
    const tableBody = document.getElementById('jobTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    mail.forEach(job => {
        const jobRow = document.createElement('tr');
        jobRow.innerHTML = `
            <td>${mail.subject}</td>
            <td>${mail.from}</td>
            <td>${mail.date}</td>
            <td>${mail.exp}</td>
            <td>
             
                <button class="btn btn-danger btn-sm" onclick="deletemail(${mail.id})">Body</button>
            </td>
        `;
        tableBody.appendChild(mailRow);
    });
}
