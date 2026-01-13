'use strict';

const os = require('os');
const { execSync } = require('child_process');

// export a function, not a fixed value
const getSystemStats = () => {
  // basic system stats
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const diskSpace = execSync("df / --output=pcent | tail -1").toString().trim();

  // UPS status defaults to null in case NUT malfunctions
  let upsInputVolts = null;
  let upsOutputVolts = null;
  let upsRuntime = null;
  let upsPowerStatus = null;

  try {
    upsInputVolts = execSync("upsc cyberpower input.voltage")
  } catch (error) {
    console.error(`NUT UPS unreachable: ${error}`)
  }

  try {
    upsOutputVolts = execSync("upsc cyberpower output.voltage")
  } catch (error) {
    console.error(`NUT UPS unreachable: ${error}`)
  }

  try {
    upsRuntime = execSync("upsc cyberpower battery.runtime")
  } catch (error) {
    console.error(`NUT UPS unreachable: ${error}`)
  }

  try {
    const command_result = execSync("upsc cyberpower ups.status 2>/dev/null");
    switch (command_result) {
      
      case command_result == 'OL':
        upsPowerStatus = "On Mains"
        break;
      
      case command_result == 'OB':
        upsPowerStatus = "On Battery"
        break;
      
      case command_result == 'OB LB':
        upsPowerStatus = "Battery Low"
        break;
      
      case command_result == 'LB':
        upsPowerStatus = "Battery Low"
        break;
      
      case command_result == 'FSD':
        upsPowerStatus = "UPS Commanded Shutdown"
        break;
    
      default:
        upsPowerStatus = "Unavailable"
        break;
    } 
 
  } catch (error) {
    console.error(`NUT UPS unreachable: ${error}`)
  }

  return {
    memory: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(1) + '%',
    uptime: (os.uptime() / 3600).toFixed(1) + ' hours',
    disk: diskSpace,
    ups_input_volts: upsInputVolts + 'v',
    ups_output_volts: upsOutputVolts + 'v',
    ups_runtime: upsRuntime + 'minutes',
    ups_power_status: upsPowerStatus

  };
};

module.exports = { getSystemStats };