import { login } from "./buisness.js"; 

const form = document.getElementById("form");
const username_input = document.getElementById("username");
const password_input = document.getElementById("password");
const params = new URLSearchParams(window.location.search);
const feedback_paragraph = document.getElementById("feedback");

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