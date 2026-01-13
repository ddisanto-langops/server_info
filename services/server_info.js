'use strict';

const os = require('os');
const { execSync } = require('child_process');

// We export a function, not a fixed value
const getSystemStats = () => {
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  
  // High-intensity logic stays here
  const diskSpace = execSync("df / --output=pcent | tail -1").toString().trim();

  return {
    memory: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(1) + '%',
    uptime: (os.uptime() / 3600).toFixed(1) + ' hours',
    disk: diskSpace
  };
};

module.exports = { getSystemStats };