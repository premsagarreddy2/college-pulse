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
            div.className = `
        bg-slate-800 rounded-2xl overflow-hidden
        shadow-lg hover:shadow-2xl
        transform hover:-translate-y-2
        transition duration-300
        border border-slate-700
    `;

            div.innerHTML = `
        <!-- Event Image -->
        <img 
            src="${event.image || 'https://source.unsplash.com/600x400/?technology,conference'}"
            alt="Event Image"
            class="w-full h-48 object-cover"
        />

        <div class="p-6 space-y-4">

            <!-- Title -->
            <h3 class="text-xl font-bold text-white">
                ${event.title}
            </h3>

            <!-- Description -->
            <p class="text-slate-400 text-sm leading-relaxed">
                ${event.description}
            </p>

            <!-- Event Details -->
            <div class="text-sm text-slate-300 space-y-1">
                <p>📅 <span class="font-medium">${event.date || "Coming Soon"}</span></p>
                <p>📍 <span class="font-medium">${event.location || "Campus Auditorium"}</span></p>
            </div>

            <!-- Register Button -->
            <button
                class="w-full bg-blue-600 hover:bg-blue-700
                       py-2 rounded-lg font-medium
                       transition duration-300">
                Register Now
            </button>
        </div>
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
