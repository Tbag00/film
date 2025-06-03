const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');

module.exports = router;