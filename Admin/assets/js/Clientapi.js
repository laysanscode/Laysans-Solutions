// Function to send client data
function sendclient(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form elements
    const form = document.getElementById('contactForm'); // Ensure your form has this ID
    const Productnameinput = document.getElementById('Productname');
    const Linkinput = document.getElementById('Link');
    const submitButton = document.getElementById('submitButton');
    const responseMessage = document.getElementById('responseMessage');

    // Get values
    const Productname = Productnameinput.value.trim();
    const Link = Linkinput.value.trim();
   
    // Basic validation
    if (!Productname || !Link) {
        alert("All fields are required.");
        return;
    }

    // Disable submit button & show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Sending...`;

    // Prepare data
    const data = { Productname, Link };

    // Send request
    fetch('https://laysans-solutions-api.onrender.com/client/', {
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

// Function to create loading placeholders
function createLoadingPlaceholders(count) {
    const tableBody = document.getElementById('clientTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    for (let i = 0; i < count; i++) {
        const placeholderRow = document.createElement('tr');
        placeholderRow.innerHTML = `
            <td class="placeholder" style="width: 150px;"></td>
            <td class="placeholder" style="width: 200px;"></td>
            <td>
                <button class="btn btn-warning btn-sm" disabled>Update</button>
                <button class="btn btn-danger btn-sm" disabled>Delete</button>
            </td>
        `;
        tableBody.appendChild(placeholderRow);
    }
}

// Function to fetch client data (GET)
async function fetchClients() {
    createLoadingPlaceholders(6); // Show 6 placeholders while loading

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/client/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const clients = await response.json();
        displayClients(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

// Function to display clients in the HTML table
function displayClients(clients) {
    const tableBody = document.getElementById('clientTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    clients.forEach(client => {
        const clientRow = document.createElement('tr');
        clientRow.innerHTML = `
            <td>${client.Productname}</td>
            <td><a href="${client.Link}" target="_blank">${client.Link}</a></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openUpdateModal(${client.id}, '${client.Productname}', '${client.Link}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteClient(${client.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(clientRow);
    });
}

// Function to update a client (PUT)
async function updateClient(id) {
    const updatedClient = {
        Productname: document.getElementById('productName').value,
        Link: document.getElementById('productLink').value
    };

    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/client/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedClient),
        });

        if (!response.ok) {
            throw new Error('Failed to update client');
        }

        const result = await response.json();
        console.log('Client updated:', result);
        fetchClients(); // Refresh the list after update
        $('#updateModal').modal('hide'); // Hide the modal
    } catch (error) {
        console.error('Error updating client:', error);
    }
}

// Function to delete a client (DELETE)
async function deleteClient(id) {
    try {
        const response = await fetch(`https://laysans-solutions-api.onrender.com/client/${id}/`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete client');
        }

        console.log('Client deleted:', id);
        showResponseMessage("Client deleted successfully!", "success"); // Show success message
        fetchClients(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting client:', error);
        showResponseMessage(`An error occurred: ${error.message}`, "danger"); // Show error message
    }
}

// Function to show response messages
function showResponseMessage(message, type) {
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.className = `alert alert-${type} text-center p-3`; // Set alert class based on type
    responseMessage.innerHTML = `<i class="fa-solid fa-circle-${type === 'success' ? 'check' : 'exclamation'}"></i> ${message}`;
    responseMessage.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        responseMessage.style.display = 'none';
    }, 5000);
}

// Function to open a modal for updating a client
function openUpdateModal(id, productName, productLink) {
    document.getElementById('clientId').value = id;
    document.getElementById('productName').value = productName;
    document.getElementById('productLink').value = productLink;
    $('#updateModal').modal('show'); // Show the modal
}

// Fetch clients when the page loads
document.addEventListener('DOMContentLoaded', fetchClients);