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
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal">View</button>
            </td>
            <td>
                <button class="btn btn-success btn-sm" data-bs-toggle="modal">Reply</button>
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

    mail.forEach((email, index) => {
        const modalId = `mailModal${index}`;
        const replyModalId = `replyModal${index}`;
        const safeBody = email.body.replace(/"/g, '&quot;');

        const mailRow = document.createElement('tr');
        mailRow.innerHTML = `
            <td>${email.subject}</td>
            <td>${email["from"]}</td>
            <td>${email.date}</td>
            <td>
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#${modalId}">View</button>
            </td>
            <td>
                <button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#${replyModalId}">Reply</button>
            </td>
        `;

        // Modal to view mail content
        const viewModal = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}Label">${email.subject}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <iframe style="border: none; width: 100%; height: 500px;" srcdoc="${safeBody}"></iframe>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Reply modal
        const replyModal = `
            <div class="modal fade" id="${replyModalId}" tabindex="-1" aria-labelledby="${replyModalId}Label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form onsubmit="return sendReply(event, '${email["from"]}', \`${email.subject}\`, \`${safeBody}\`)">
                            <div class="modal-header">
                                <h5 class="modal-title" id="${replyModalId}Label">Reply to ${email["from"]}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <textarea class="form-control" name="replyMessage" placeholder="Your message..." rows="6" required></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary">Send Reply</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        tableBody.appendChild(mailRow);
        document.body.insertAdjacentHTML('beforeend', viewModal + replyModal);
    });
}


async function sendReply(event, to, subject, originalBody) {
    event.preventDefault();
    const form = event.target;
    const replyText = form.replyMessage.value.trim();

    if (!replyText) return;

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/replymail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // Only needed if using Django CSRF protection
            },
            body: JSON.stringify({
                to: to,
                subject: subject,
                reply: replyText,
                original_body: originalBody
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Reply sent successfully!');
            form.closest('.modal').querySelector('.btn-close').click();
        } else {
            alert(`Failed to send reply: ${result.error}`);
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('An error occurred while sending the reply.');
    }

    return false;
}
document.addEventListener('DOMContentLoaded', () => {
    fetchmail();
    sendReply();
});
