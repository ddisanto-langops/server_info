async function updateDashboard() {
    try {
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

    } catch (error) {
        console.error(`Could not reach server logic script: ${error}`)
    }
}

updateDashboard();
setInterval(updateDashboard, 10000);