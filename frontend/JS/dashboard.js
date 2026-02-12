const API_URL = "https://college-pulse-j5bn.onrender.com";

// Protect page
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

// Role-based UI
const role = localStorage.getItem("role");

document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById("createEventBtn");

    if (role === "student" && createBtn) {
        createBtn.style.display = "none";
    }

    // Attach filter listeners
    const searchInput = document.getElementById("searchInput");
    const dateFilter = document.getElementById("dateFilter");

    if (searchInput) searchInput.addEventListener("input", filterEvents);
    if (dateFilter) dateFilter.addEventListener("change", filterEvents);
});

// Store events globally for filtering
let allEvents = [];

// Fetch events
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/api/events`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json();
        allEvents = data.events || [];

        renderEvents(allEvents);

    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Render events
function renderEvents(events) {
    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    if (!events || events.length === 0) {
        container.innerHTML = `
            <p class="text-gray-500 col-span-3 text-center">
                No events found.
            </p>`;
        return;
    }

    events.forEach(event => {

        const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const imageUrl = event.image
            ? `${API_URL}${event.image}`
            : "https://source.unsplash.com/600x400/?event";

        const registrationCount = event.registrationCount || 0;

        const div = document.createElement("div");

        div.className = `
            bg-white dark:bg-slate-800
            rounded-2xl
            border border-gray-200 dark:border-slate-700
            hover:shadow-lg
            transition duration-300
        `;

        div.innerHTML = `
            <img src="${imageUrl}"
                 class="w-full h-48 object-cover rounded-t-2xl" />

            <div class="p-6 space-y-4">

                <h3 class="text-xl font-semibold">
                    ${event.title}
                </h3>

                <p class="text-sm text-gray-600 dark:text-gray-400">
                    ${event.description.substring(0, 120)}...
                </p>

                <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>📅 ${formattedDate}</p>
                    <p>📍 ${event.venue}</p>
                    <p>⏳ ${event.durationHours} hrs</p>
                    <p>👥 ${registrationCount} Registered</p>
                </div>

                <button onclick="registerEvent('${event._id}')"
                    class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Register
                </button>

            </div>
        `;

        container.appendChild(div);
    });
}

// Search + Date Filter
function filterEvents() {
    const searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const selectedDate = document.getElementById("dateFilter")?.value || "";

    const filtered = allEvents.filter(event => {

        const matchesSearch =
            event.title.toLowerCase().includes(searchValue) ||
            event.description.toLowerCase().includes(searchValue);

        const matchesDate = selectedDate
            ? event.date.startsWith(selectedDate)
            : true;

        return matchesSearch && matchesDate;
    });

    renderEvents(filtered);
}

// Register event
async function registerEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Successfully Registered!");

        // Refresh events to update count
        fetchEvents();

    } catch (error) {
        alert("Registration failed");
    }
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

fetchEvents();
