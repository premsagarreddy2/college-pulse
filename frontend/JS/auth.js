const API_URL = "https://college-pulse-j5bn.onrender.com/";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent = data.message || "Login failed";
            return;
        }

        // Save JWT
        localStorage.setItem("token", data.token);

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        errorMessage.textContent = "Server error. Try again.";
    }
});
