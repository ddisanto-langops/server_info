async function updateDashboard() {
    try {
        // The fetch 
        const response = await fetch('/status');
        const server_data = await response.json();

        const memoryDisplay = document.getElementById('memory-value');
        if (memoryDisplay) {
            memoryDisplay.innerText = server_data.memory

        }

        const uptimeDisplay = document.getElementById('uptime-value');
        if (uptimeDisplay) {
            uptimeDisplay.innerText = server_data.uptime
        }

        const diskUsageDisplay = document.getElementById('disk-value');
        if (diskUsageDisplay) {
            diskUsageDisplay.innerText = server_data.disk
        }

        const upsInputVolts = document.getElementById('input-volts-value');
        if (upsInputVolts) {
            upsInputVolts.innerText = server_data.ups_input_volts
        }

        const upsOutputVolts = document.getElementById('output-volts-value');
        if (upsOutputVolts) {
            upsOutputVolts.innerText = server_data.ups_output_volts
        }

        const upsRuntime = document.getElementById('ups-runtime-value');
        if (upsRuntime) {
            upsRuntime.innerText = server_data.ups_runtime
        }

        const upsStatus = document.getElementById('ups-status-value');
        if (upsStatus) {
            upsStatus.innerText = server_data.ups_power_status
        }
        // This card's value can change color if UPS is on battery
        const onBattery = server_data.ups_power_status === "On Battery" || server_data.ups_power_status === "Battery Low";
        upsStatus.classList.toggle('status-warn', onBattery);
 

    } catch (error) {
        console.error(`Could not reach server logic script: ${error}`)
    }
}

updateDashboard();
setInterval(updateDashboard, 10000);