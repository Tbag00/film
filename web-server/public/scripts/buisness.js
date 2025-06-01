export async function login(user, password) {
    if (!user || !password) {
        const message = "Username and password are required";
        console.error(message);
        return { error: message };
    }
    try {
        const res = await fetch("/api/login", {
            "method": "POST", 
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({ username: user, password: password })
        });
        return res.json();
    }
    catch (error) {
        console.error("Error during login:", error);
    }
}