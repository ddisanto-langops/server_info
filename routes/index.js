const express = require('express');
const router = express.Router();
const path = require('path')
const server = require('../services/server_info')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/status', function(req, res) {
  const server_data = server.getSystemStats();
  res.json(server_data)
});

module.exports = router;