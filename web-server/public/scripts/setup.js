import { login, createUser } from "./buisness.js"; 

// Feedback
const params = new URLSearchParams(window.location.search);
const feedback_paragraph = document.getElementById("feedback");

// Login form elements
const form = document.getElementById("form");
const username_input = document.getElementById("username");
const password_input = document.getElementById("password");

// Register form elements
const register_form = document.getElementById("register-form");
const register_username = document.getElementById("register-username");
const register_password = document.getElementById("register-password");
const register_type = document.getElementById("register-type");

// Logout handling
const logout_form = document.getElementById("logout-form");

function showError(error) {
    feedback_paragraph.textContent = error;
    console.log(error);
    feedback_paragraph.color = "red";
}
function showSuccess(message) {
    feedback_paragraph.textContent = message;
    console.log(message);
    feedback_paragraph.color = "green";
}

if(params.get("logout") == 1) {
    showSuccess("Logout successful");
}
if(params.get("error") == 1) {
    showError("Invalid username or password");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const username = username_input.value;
    const password = password_input.value;

    const res = await login(username, password);
    if(res.error) {
        showError(res.error);
    }
    else {
        showSuccess(res.message);
    }
})

register_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = register_username.value;
    const password = register_password.value;
    const type = register_type.value;

    if (!username || !password || !type) {
        showError("All fields are required");
        return;
    }
    const data = await createUser(username, password, type);
    if (data.success === false) {
        showError(data.error);
    } else if (data.success) {
        showSuccess("User created successfully");
    }
});

logout_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(res.ok) {
        window.location.href = "/?logout=1";
    } else {
        showError("Logout failed");
    }
});