class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // Show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        // Add the user's message to the chat
        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        // Send the message to Django API
        fetch('http://127.0.0.1:8000/chatai/', {  // Correct URL
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(r => r.json())  // Parse the JSON response
        .then(r => {
            // Make sure the response contains the expected 'answer'
            if (r && r.answer) {
                let msg2 = { name: "Testla", message: r.answer }; // Assuming response has 'answer'
                this.messages.push(msg2);
            } else {
                console.error('Invalid response format:', r);  // Log if the response does not contain 'answer'
            }
            
            // Update the chat UI with the new message
            this.updateChatText(chatbox);
            textField.value = '';  // Clear the input field
        })
        .catch((error) => {
            console.error('Error:', error);  // Log any errors
            this.updateChatText(chatbox);  // Update chat UI even in case of an error
            textField.value = '';  // Clear the input field
        });
    }

    updateChatText(chatbox) {
        var html = '';
        
        // Iterate through the messages array and build HTML
        this.messages.slice().reverse().forEach(function (item) {
            if (item.name === "Testla") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        // Update the chatbox with the new messages
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
