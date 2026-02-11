const API_URL = "https://college-pulse-j5bn.onrender.com";

document.getElementById("createEventForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("date", document.getElementById("date").value);
        formData.append("venue", document.getElementById("venue").value);
        formData.append("durationHours", document.getElementById("durationHours").value);

        const imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`${API_URL}/api/events`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error creating event");
                return;
            }

            alert("Event created successfully!");
            window.location.href = "dashboard.html";

        } catch (error) {
            alert("Server error");
        }
    });
