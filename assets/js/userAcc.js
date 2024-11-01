import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration (replace with your actual config)
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

// Get the username from local storage
const username = localStorage.getItem("username");
let userData;

// Function to retrieve user data
function fetchUserData(username) {
    const databaseRef = ref(database);
    get(child(databaseRef, `users/${username}`)) // Assuming your users are stored under "users"
        .then((snapshot) => {
            if (snapshot.exists()) {
                userData = snapshot.val();
                updateUserInfo(userData);
            } else {
                console.error("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: ", error);
        });

    const userRef = ref(database, `users/${username}`);

    return get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Returns the user data
        } else {
            console.error("No user data found.");
            return null; // Ensure null is returned
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
        return null; // Ensure null is returned on error
    });
}

// Function to update the DOM with user information
function updateUserInfo(userData) {
    // Update the username and security code in the DOM
    const welcomeMsgUserName = document.querySelector(".Welcome-message .userName");
    const userDetailName = document.querySelector(".user-detail h1")
    const securityCodeElement = document.querySelector(".security-code");

    userDetailName.innerHTML = `${userData.firstName} ${userData.lastName}`; // Assuming username is stored in the user data
    welcomeMsgUserName.innerHTML = `${userData.firstName} ${userData.lastName}`; // Assuming username is stored in the user data
}


// Function to count members
function countMembers() {
    const membersRef = ref(database, 'users'); // Reference to the users node
    get(membersRef) // Fetch the users data
        .then((snapshot) => {
            if (snapshot.exists()) {
                let memberCount = 0; // Counter for members
                const members = snapshot.val(); // Get the users data

                for (let username in members) { // Loop through each member
                    memberCount++; // Increase the count for each member
                }

                document.querySelector(".hack-members h1 .memebers-count")
                    .innerText = `${memberCount}`;
            } else {
                console.error("No members data available");
            }
        })
        .catch((error) => {
        });
}

// Function to fetch user data
// Function to fetch and display all members
function fetchMembers() {
    const membersRef = ref(database, 'users'); // Reference to the users node
    get(membersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const members = snapshot.val(); // Get the users data
                const memberCount = Object.keys(members).length; // Count total members
                const memberCountElement = document.querySelector('.hack-members h1'); // Select the member count element

                // Update the member count display
                if (memberCountElement) {
                    memberCountElement.textContent = `${memberCount} Members`; // Update the count display
                } else {
                }

                // Display first five members
                const memberContainer = document.querySelector('.hack-members'); // Container for members

                // Clear existing member elements
                memberContainer.querySelectorAll('.member').forEach(member => member.remove());

                // Get the first five usernames
                const memberNames = Object.keys(members).slice(0, 5); // Get the first five usernames

                // Display the first five members
                memberNames.forEach(username => {
                    const memberElement = document.createElement('div');
                    memberElement.classList.add('member');
                    memberElement.innerHTML = `<i class="fa-solid fa-user-tie"></i><h3>${members[username].firstName} ${members[username].lastName}</h3>`; // Assuming you want to show first and last name
                    memberContainer.appendChild(memberElement); // Append member element to the container
                });
            } else {

            }
        })
        .catch((error) => {
            console.error("Error fetching members data: ", error);
        });
}


// Fetch members data when the page loads
window.onload = () => {
    fetchMembers();
    fetchUserData(username);
    countMembers();
};





document.querySelector('.user-detail .fa-eye')
    .addEventListener('click', () => {
        document.querySelector('.user-detail .code')
            .innerHTML = `${userData.securityCode} <i class="fa-solid fa-eye-slash"></i>`;
    });
document.querySelector('.user .fa-eye')
    .addEventListener('click', () => {
        document.querySelector('.databse-info .code')
            .innerHTML = `${userData.securityCode} <i class="fa-solid fa-eye-slash"></i>`;
    });



const storedUsername = localStorage.getItem("username");
let AdminOrmember;
if (username === "Arafat_Mohammed") {
    AdminOrmember = "Admin"
}
else {
    AdminOrmember = "member"
};

document.getElementById("groupChat").addEventListener('click', () => {
    fetchUserData(storedUsername).then(userData => {
        if (userData) {
            const securityCode = userData.securityCode; // Get security code from user data
            // Construct the inbox link with the security code at the end
            window.location.href = `GroupChat.html?user=${storedUsername}(${AdminOrmember})`;
        }
    });
});

document.getElementById("inboxLink").addEventListener('click', () => {
    fetchUserData(storedUsername).then(userData => {
        if (userData) {
            const securityCode = userData.securityCode; // Get security code from user data
            // Construct the inbox link with the security code at the end
            window.location.href = `Inbox.html?user=${storedUsername}`;
        }
    });
});

document.querySelector(`.profile-link`)

document.querySelector('.submit-btn').addEventListener('click', () => {
    submitData();
});








// Function to check if the user has already submitted their team
function checkUserSubmission() {
    const selectedTeam = document.getElementById("options").value; // Get the current value of the dropdown
    const savedValue = localStorage.getItem("selectedTeam");

    // Reference to the user's section under the selected team in the database
    const userRef = ref(database, `/${savedValue}/${username}`);

    // Check if the user already exists in the selected team
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                // User has already submitted their team, hide the dropdown and button
                document.getElementById("options").style.display = "none"; // Hide dropdown
                document.querySelector('.submit-btn').style.display = "none"; // Hide submit button
                document.querySelector('.team').style.display = "none"; // Hide the team selection message
                document.querySelector('.team-choosed').style.display = "block"; // Show the team choosed message 
                document.querySelector('.team-database').innerHTML = snapshot.val().selectedTeam; // Show the team choosed message
            } else {
                // User has not submitted, show the dropdown and button
                document.getElementById("options").style.display = "block"; // Show dropdown
                document.querySelector('.submit-btn').style.display = "block"; // Show submit button
                document.querySelector('.choose-team h1').style.display = "block"; // Show the choose team message
                document.querySelector('.team').style.display = "grid"; // Hide the team selection message
            }
        })
        .catch((error) => {
            console.error("Error checking user submission: ", error);
        });
}

// Function to handle submission of team data
function submitData() {
    const selectedTeam = document.getElementById("options").value;
    const userRef = ref(database, `/${selectedTeam}/${username}`);
    localStorage.setItem("selectedTeam", selectedTeam);

    // Check if the user has already submitted their team
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                // User already exists in the team, do not allow multiple submissions
                document.getElementById("options").style.display = "none"; // Hide the dropdown
                document.querySelector('.submit-btn').style.display = "none"; // Hide the button
                document.querySelector('.team').style.display = "none"; // Hide the team selection message
                document.querySelector('.choose-team h1').style.display = "none"; // Hide the team selection message
                document.querySelector('.team-choosed').style.display = "block"; // Show the team choosed message   
            } else {
                // User doesn't exist in the selected team, proceed to save their data
                set(userRef, {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    securityCode: userData.securityCode,
                    selectedTeam: selectedTeam
                })
                    .then(() => {
                        document.getElementById("options").style.display = "none"; // Hide dropdown after submission
                        document.querySelector('.submit-btn').style.display = "none"; // Hide the button after submission
                        document.querySelector('.team').style.display = "none"; // Hide the team selection message
                        document.querySelector('.choose-team h1').style.display = "none"; // Hide the team selection message
                        document.querySelector('.team-database').innerHTML = selectedTeam; // Show the team choosed message
                        document.querySelector('.team-choosed').style.display = "block"; // Show the team choosed message   
                    })
                    .catch((error) => {
                        console.error("Error saving team selection: ", error);
                        alert("There was an error saving your selection.");
                    });
            }
        })
        .catch((error) => {
            console.error("Error checking if user exists: ", error);
            alert("There was an error checking your previous submission.");
        });
}

// Call checkUserSubmission on page load
window.onload = () => {
    fetchMembers();
    fetchUserData(username);
    countMembers();
    checkUserSubmission(); // Check if the user has already submitted their team
};

// Event listener for the submit button
document.querySelector('.submit-btn').addEventListener('click', () => {
    submitData();
});


// Check if the role in the database is Admin and log "hi" if true
fetchUserData(username).then(userData => {
    if (userData && userData.role === "Paid" || userData.role === "Admin") {
        document.querySelector('.pending').innerHTML = "Paid";
        document.querySelector('.pending').style.color = "hsl(163, 88%, 50%)";
    }
    else {
        document.querySelector('.pending').innerHTML = "pending";
        document.querySelector('.pending').style.color = "red";
    }
});
