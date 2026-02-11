const API_URL = "https://college-pulse-j5bn.onrender.com";

// Protect page
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

// Fetch events
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/api/events`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json();
        console.log("API Response:", data);

        const container = document.getElementById("eventsContainer");
        container.innerHTML = "";

        const events = data.events;

        if (!events || events.length === 0) {
            container.innerHTML = "<p>No events found.</p>";
            return;
        }

        events.forEach(event => {
            const div = document.createElement("div");
            div.className = "bg-gray-800 p-4 rounded";
            div.innerHTML = `
                <h3 class="font-bold">${event.title}</h3>
                <p>${event.description}</p>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error fetching events:", error);
    }
}


function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

fetchEvents();
