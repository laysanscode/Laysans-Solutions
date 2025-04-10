// Function to get CSRF token (for POST/DELETE if needed)
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

// Function to show loading placeholders
function createLoadingPlaceholders(count) {
    const tableBody = document.getElementById('mailTableBody');
    tableBody.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const placeholderRow = document.createElement('tr');
        placeholderRow.innerHTML = `
            <td class="placeholder" style="width: 150px; background-color: #f0f0f0;">&nbsp;</td>
            <td class="placeholder" style="width: 100px; background-color: #f0f0f0;">&nbsp;</td>
            <td class="placeholder" style="width: 150px; background-color: #f0f0f0;">&nbsp;</td>
            <td class="placeholder" style="width: 50px; background-color: #f0f0f0;">&nbsp;</td>
            <td>
                <button class="btn btn-warning btn-sm" disabled>Update</button>
                <button class="btn btn-danger btn-sm" disabled>Delete</button>
            </td>
        `;
        tableBody.appendChild(placeholderRow);
    }
}

// Function to fetch mail data
async function fetchmail() {
    createLoadingPlaceholders(6); // Show placeholders while loading

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/mailinbox/');
        console.log('Response:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Network response was not ok:', errorText);
            throw new Error('Network response was not ok');
        }

        const mail = await response.json();
        console.log('Fetched mail:', mail);
        displaymail(mail);
    } catch (error) {
        console.error('Error fetching mail:', error);
    }
}

// Function to display mail in the table
function displaymail(mail) {
    const tableBody = document.getElementById('mailTableBody');
    tableBody.innerHTML = '';

    if (!Array.isArray(mail) || mail.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No mail found.</td></tr>`;
        return;
    }

    mail.forEach(email => {
        const mailRow = document.createElement('tr');
        mailRow.innerHTML = `
            <td>${email.subject}</td>
            <td>${email["from"]}</td> <!-- Using bracket notation for reserved word -->
            <td>${email.date}</td>
            <td>${email.body}</td>
            <td>
            </td>
        `;
        tableBody.appendChild(mailRow);
    });
}

// Optionally implement this if DELETE is supported

// Call fetchmail on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchmail();
});
