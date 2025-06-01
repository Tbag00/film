const express = require('express');
const router = express.Router();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

app.post('/api/verify-token', async (req, res) => {
    return res.status(200).json({
        valid: true,
        user: {
            id: 1,
            username: "testuser",
            type: "admin"
        }
    });
})
app.post('/api/login', async (req, res) => {
    return res.status(200).json({
        token: "testtoken1234567890"
    });
});

app.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
});