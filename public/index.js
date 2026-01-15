/* 
Overview for future reference:
This fetches the data from the service(s) defined in /services
In /routes/index.js, the /status endpoint is defined with the router. 
in /routes/index.js, require the service, in this case, the server info: server = require('../services/server_info')
Then, call the function: server.getSystemStats() within the router.get() function and return server data as JSON.
        
*/

async function updateDashboard() {
    try {
        const response = await fetch('/status');
        const server_data = await response.json();

        // System load allows for warning format if === "High"
        const systemLoad = document.getElementById('system-load-value');
        if (systemLoad) {
            systemLoad.innerText = server_data.system_load
        }
        const highLoad = server_data.system_load === "High"
        systemLoad.classList.toggle('status-warn', highLoad);

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
        // The UPS status card's class can be toggled to show if UPS is on battery
        const onBattery = server_data.ups_power_status === "On Battery" || server_data.ups_power_status === "Battery Low";
        upsStatus.classList.toggle('status-warn', onBattery);
 

    } catch (error) {
        console.error(`Could not reach server logic script: ${error}`)
    }
}

async function initializeSidebar() {
    const response = await fetch('/services');
    const services_data = await response.json();

    const sidebar = document.getElementById('services-list');
    sidebar.innerHTML = '';
    services_data.forEach(service => {
        const service_div = document.createElement('div');
        service_div.className = 'service-list-item'
        service_div.id = `${service.name}`
        service_div.innerHTML = `
        <div class="service-name">${service.name}</div>
        <div class="service-status" id="status-${service.name}">Checking...</div>
        `;
        sidebar.appendChild(service_div)
    });
}

async function updateSidebarStatuses() {
    try {
        const response = await fetch('/services');
        const services_data = await response.json();

        services_data.forEach(service => {
            const statusEl = document.getElementById(`status-val-${service.name}`);
            if (statusEl) {
                statusEl.innerText = service.status;
                // Add color coding
                statusEl.style.color = service.status === 'active' ? '#2ecc71' : '#e74c3c';
            }
        });
    } catch (e) { console.error("Status update failed", e); }
}


initializeSidebar().then(() => {
    setInterval(updateSidebarStatuses, 10000);
});

updateDashboard();
updateSidebarStatuses();
setInterval(updateDashboard, 10000);