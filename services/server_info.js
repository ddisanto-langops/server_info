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
    upsRuntime = Number(execSync("upsc cyberpower battery.runtime")) / 60
  } catch (error) {
    console.error(`NUT UPS unreachable: ${error}`)
  }

  try {
    const command_result = execSync("upsc cyberpower ups.status 2>/dev/null", { encoding: 'utf8' }).trim();
    console.log(command_result)
    switch (command_result) {
      
      case 'OL':
        upsPowerStatus = "Normal"
        break;
      
      case 'OB':
        upsPowerStatus = "On Battery"
        break;
      
      case 'OB LB':
        upsPowerStatus = "Battery Low"
        break;
      
      case 'LB':
        upsPowerStatus = "Battery Low"
        break;
      
      case 'FSD':
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