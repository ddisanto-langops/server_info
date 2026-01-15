const express = require('express');
const router = express.Router();
const path = require('path')
const server = require('../services/server_info')
const services =  require('../services/apps_services_info')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/status', function(req, res) {
  const server_data = server.getSystemStats();
  res.json(server_data)
});

router.get('/services', function(req, res, next) {
  const services_data = services.getServiceStatus();
  res.json(services_data)
});

module.exports = router;