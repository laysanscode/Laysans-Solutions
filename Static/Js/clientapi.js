// Function to create and display loading placeholders for clients
function createClientLoadingPlaceholders(count) {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = ''; // Clear existing content

    for (let i = 0; i < count; i++) {
        const placeholderItem = document.createElement('div');
        placeholderItem.className = 'col-lg-6 col-md-4 col-sm-12 portfolio-item filter-web mb-4';
        placeholderItem.innerHTML = `
            <div class="portfolio-wrap">
                <div class="placeholder-icon" style="width: 100%; height: 300px; background-color: #e0e0e0; border-radius: 4px; margin-bottom: 15px;"></div>
                <div class="portfolio-info text-center">
                    <h4>
                        <span class="placeholder-text" style="display: inline-block; width: 80%; height: 24px; background-color: #e0e0e0; border-radius: 4px;"></span>
                    </h4>
                    <div class="portfolio-links">
                        <span class="placeholder-text" style="display: inline-block; width: 40%; height: 18px; background-color: #e0e0e0; border-radius: 4px;"></span>
                    </div>
                </div>
            </div>
        `;
        clientList.appendChild(placeholderItem);
    }
}

// Function to fetch clients
async function fetchClients() {
    createClientLoadingPlaceholders(6); // Show 6 placeholders while loading

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

// Function to display clients in the HTML
function displayClients(clients) {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = ''; // Clear existing content

    clients.forEach(client => {
        const clientItem = document.createElement('div');
        clientItem.className = 'col-lg-6 col-md-4 col-sm-12 portfolio-item filter-web';
        clientItem.innerHTML = `
            <div class="portfolio-wrap">
                <iframe class="embed-responsive-item" src="${client.Link}" allowfullscreen scrolling="no" style="width: 100%; height: 300px;"></iframe>
                <div class="portfolio-info text-center">
                    <h4>${client.Productname}</h4>
                    <div class="portfolio-links">
                        <a href="${client.Link}" target="_blank" class="portfolio-lightbox" title="${client.name}"><i class="fas fa-link"></i></a>
                    </div>
                </div>
            </div>
        `;
        clientList.appendChild(clientItem);
    });
}

// Fetch clients when the page loads
window.onload = fetchClients;