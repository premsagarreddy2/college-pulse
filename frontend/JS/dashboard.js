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
            const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            const formattedTime = new Date(event.date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });

            const div = document.createElement("div");
            div.className = `
        bg-slate-800 rounded-2xl overflow-hidden
        shadow-lg hover:shadow-2xl
        transform hover:-translate-y-2
        transition duration-300
        border border-slate-700
    `;

            div.innerHTML = `
    <img 
        src="${event.image || 'https://source.unsplash.com/600x400/?technology,conference'}"
        class="w-full h-48 object-cover"
    />

    <div class="p-6 space-y-4">

        <h3 class="text-xl font-bold">
            ${event.title}
        </h3>

        <p class="text-slate-400 text-sm">
            ${event.description}
        </p>

        <div class="space-y-2 text-sm text-slate-300">

            <div class="flex items-center gap-2">
                <span>📅</span>
                <span>${formattedDate}</span>
            </div>

            <div class="flex items-center gap-2">
                <span>⏰</span>
                <span>${formattedTime}</span>
            </div>

            <div class="flex items-center gap-2">
                <span>📍</span>
                <span>${event.location || "Campus Auditorium"}</span>
            </div>

        </div>

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
