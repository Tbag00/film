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
export async function createUser(username, password, type) {
    try {
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, type })
        });

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error creating user:", error);
        return { success: false, message: "Internal server error" };
    }
}