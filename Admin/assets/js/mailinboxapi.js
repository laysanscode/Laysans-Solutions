// Function to get CSRF token (if needed for Django)
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

// Escape text to safely display as HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
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
                <button class="btn btn-primary btn-sm">View</button>
            </td>
            <td>
                <button class="btn btn-success btn-sm">Reply</button>
            </td>
        `;
        tableBody.appendChild(placeholderRow);
    }
}

// Fetch mail data
async function fetchmail() {
    createLoadingPlaceholders(6);

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/mailinbox/');
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Fetch failed:', errorText);
            throw new Error('Network response was not ok');
        }

        const mail = await response.json();
        displaymail(mail);
    } catch (error) {
        console.error('Error fetching mail:', error);
    }
}

// Display mail and attach modals/events
function displaymail(mail) {
    const tableBody = document.getElementById('mailTableBody');
    tableBody.innerHTML = '';

    // Remove old modals
    document.querySelectorAll('.dynamic-modal').forEach(modal => modal.remove());

    if (!Array.isArray(mail) || mail.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No mail found.</td></tr>`;
        return;
    }

    mail.forEach((email, index) => {
        const modalId = `mailModal${index}`;
        const replyModalId = `replyModal${index}`;
        const formId = `replyForm${index}`;
        const textareaId = `replyMessage${index}`;

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

        // View modal
        const viewModal = `
            <div class="modal fade dynamic-modal" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}Label">${email.subject}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="email-body-container" style="background: #fff; padding: 20px; border-radius: 8px; max-height: 500px; overflow-y: auto;">
                                ${escapeHtml(email.body)}
                            </div>
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
            <div class="modal fade dynamic-modal" id="${replyModalId}" tabindex="-1" aria-labelledby="${replyModalId}Label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form id="${formId}">
                            <div class="modal-header">
                                <h5 class="modal-title" id="${replyModalId}Label">Reply to ${email["from"]}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <textarea class="form-control" id="${textareaId}" placeholder="Your message..." rows="6" required></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary submit-reply-btn">Send Reply</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        tableBody.appendChild(mailRow);
        document.body.insertAdjacentHTML('beforeend', viewModal + replyModal);

        // Add event listener for reply form
        setTimeout(() => {
            const form = document.getElementById(formId);
            const textarea = document.getElementById(textareaId);
            if (form && textarea) {
                form.addEventListener('submit', (event) => {
                    sendReply(event, email["from"], email.subject, email.body, textarea);
                });
            }
        }, 100);
    });
}

// Handle reply
async function sendReply(event, to, subject, originalBody, textareaElement) {
    event.preventDefault();

    const replyText = textareaElement.value.trim();
    if (!replyText) return;

    const form = textareaElement.closest('form');
    const submitBtn = form.querySelector('.submit-reply-btn');
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://laysans-solutions-api.onrender.com/replymail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': getCookie('csrftoken') // Uncomment if needed
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
            textareaElement.value = '';

            const modal = textareaElement.closest('.modal');
            if (modal) {
                const closeButton = modal.querySelector('.btn-close');
                if (closeButton) closeButton.click();
            }
        } else {
            alert(`Failed to send reply: ${result.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('An error occurred while sending the reply.');
    } finally {
        submitBtn.disabled = false;
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    fetchmail();
});
