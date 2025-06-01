const logout_button = document.getElementById("form");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("logout initiated");
    try {
        const res = await fetch("/api/logout");
        if(res.redirected) {
            window.location.href = res.url;
        }
        if(res.error) {
            console.log(res.error);
            feedback.textContent = res.error;
            feedback.color = "red";
        }
    }
    catch(err) {
        console.log(err);
    }
});