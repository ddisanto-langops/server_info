// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-active')
        });
    }
});

/* 
Overview for future reference:
This fetches the data from the service(s) defined in /services
In /routes/index.js, the /status endpoint is defined with the router. 
in /routes/index.js, require the service, in this case, the server info: server = require('../services/server_info')
Then, call the function: server.getSystemStats() within the router.get() function and return server data as JSON.       
*/
async function updateDashboard() {
    try {
        // see /routes/index.js for the defined routes query with fetch()
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
        // 
        /*
        The UPS status card's class can be toggled to show if UPS is on battery.
        First set the CSS to target the desired class.
        Then follow essentally this pattern:
        1. Determine the element to modify using getElementById()
        2. Set a condition which evaluates to true
        3. use classList.toggle('css-class', condition)
        */
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
        service_div.id = `${service.id}`
        service_div.innerHTML = `
        <div class="service-name">${service.name}</div>
        <div class="service-container">
            <div class="status-button" id="${service.id}-status-button"></div>
            <div class="service-status" id="${service.id}-status">Checking...</div>
        </div>
        `;
        sidebar.appendChild(service_div)
    });
}

async function updateSidebarStatuses() {
    try {
        const response = await fetch('/services');
        const services_data = await response.json();

        services_data.forEach(service => {
            
            // Make the box glow red around the edges if service is down
            const statusBox = document.getElementById(`${service.id}`);
            const inactive = service.status != 'active';
            statusBox.classList.toggle('service-warn', inactive);

            // change the status button color if service is down
            const statusButton = document.getElementById(`${service.id}-status-button`)
            statusButton.classList.toggle('status-button-warn', inactive)

            // Set the status returned by the server
            const statusElement = document.getElementById(`${service.id}-status`);
            if (statusElement) {
                statusElement.innerText = service.status;

                // Determine color coding
                statusElement.style.color = service.status === 'active' ? '#2ecc71' : '#e74c3c';
            }
        });
    } catch (e) { console.error("Status update failed", e); }
}

async function startApp() {
    // 1. First, build the sidebar structure
    await initializeSidebar();

    // 2. Immediately fill the dashboard and sidebar with real data
    updateDashboard();
    updateSidebarStatuses();

    // 3. Set timers to refresh that data every 10 seconds
    setInterval(updateDashboard, 10000);
    setInterval(updateSidebarStatuses, 10000);
}

// Start everything
startApp();