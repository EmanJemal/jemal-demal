import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVIym8X-GDRx6_1256dtVZdo3hIm7TRgI",
    authDomain: "flipper-hack.firebaseapp.com",
    databaseURL: "https://flipper-hack-default-rtdb.firebaseio.com",
    projectId: "flipper-hack",
    storageBucket: "flipper-hack.appspot.com",
    messagingSenderId: "9118741906",
    appId: "1:9118741906:web:d8860d3094a46bafd37d4b",
    measurementId: "G-EYLLFHW5XS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to load group data based on username
function loadGroupData() {
    const username = localStorage.getItem('username'); // Get username from local storage

    if (!username) {
        alert("No user found. Please log in.");
        window.location.href = "userAcc.html"; // Redirect if no user found
        return;
    }

    // Reference to the users in your Firebase database
    const usersRef = ref(database, `users/${username}`);

    // Get user data to find firstName
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const firstName = userData.firstName; // Extract the firstName

            // Now check the groups for this firstName
            const groupsRef = ref(database, 'groups');
            onValue(groupsRef, (snapshot) => {
                const groups = snapshot.val();
                let foundGroup = false;

                for (let groupId in groups) {
                    const group = groups[groupId];
                    if (group.members && group.members.includes(firstName)) {
                        foundGroup = true;

                        // Display group name
                        document.getElementById('group-name').textContent = group.name;

                        // Display members
                        const membersContainer = document.getElementById('members-container');
                        membersContainer.innerHTML = ''; // Clear previous members

                        group.members.forEach(member => {
                            const memberElement = document.createElement('div');
                            memberElement.textContent = member;
                            membersContainer.appendChild(memberElement);
                        });

                        // Display chat messages
                        displayMessages(group.messages);
                    }
                }

                if (!foundGroup) {
                    alert("You are not a member of any group.");
                }
            });
        } else {
            alert("User not found in the database.");
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
    });
}

// Function to display chat messages
function displayMessages(messages) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    chatMessagesContainer.innerHTML = ''; // Clear existing messages

    if (messages) {
        messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');
            messageElement.textContent = message;
            chatMessagesContainer.appendChild(messageElement);
        });
    }

    // Scroll to the bottom of the chat
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Call the loadGroupData function on page load
window.onload = loadGroupData;

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', function () {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    const username = localStorage.getItem('username'); // Get username

    if (message) {
        // Save message to Firebase
        const messagesRef = ref(database, `groups/messages`);

        // Use onValue to retrieve current messages
        onValue(messagesRef, (snapshot) => {
            const currentMessages = snapshot.val() || [];
            currentMessages.push(`${username}: ${message}`); // Add username to message

            set(messagesRef, currentMessages) // Update messages in Firebase
                .then(() => {
                    displayMessages(currentMessages); // Update displayed messages
                })
                .catch(error => {
                    console.error("Error updating messages: ", error);
                });

            chatInput.value = ''; // Clear input
        });
    }
});
