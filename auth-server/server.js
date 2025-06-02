const express = require('express');
const routes = require('./routes.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use('/', routes);

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


app.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
});