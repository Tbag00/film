const express = require('express');
const routes = require('./routes.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
});