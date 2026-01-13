async function updateDashboard() {
    try {
        const response = await fetch('/status');
        const server_data = await response.json();

        const memoryDisplay = document.getElementById('memory');
        if (memoryDisplay) {
            memoryDisplay.innerText = `RAM Usage: ${server_data.memory}`

        }

        const uptimeDisplay = document.getElementById('uptime');
        if (uptimeDisplay) {
            uptimeDisplay.innerText = `Uptime: ${server_data.uptime}`
        }

        const diskUsageDisplay = document.getElementById('disk');
        if (diskUsageDisplay) {
            diskUsageDisplay.innerText = `Disk Usage: ${server_data.disk}`
        }

    } catch (error) {
        console.error(`Could not reach server logic script: ${error}`)
    }
}

updateDashboard();
setInterval(updateDashboard, 10000);