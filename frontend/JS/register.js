const API_URL = "https://college-pulse-j5bn.onrender.com";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (!name || !email || !password) {
        errorMessage.textContent = "All fields are required.";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent = data.message || "Registration failed.";
            return;
        }

        // Save token & role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "student");

        // Redirect
        window.location.href = "dashboard.html";

    } catch (error) {
        errorMessage.textContent = "Server error. Please try again.";
    }
});
