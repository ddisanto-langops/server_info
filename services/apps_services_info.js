const { execSync } = require('child_process');

function getServiceStatus(serviceName) {
    try {
        // Must use sudo and trim the result
        return execSync(`sudo systemctl is-active ${serviceName}`).toString().trim();
    } catch (error) {
        // If it's inactive, systemctl returns exit code 3. 
        // Node sees that as an error, so we catch it here.
        if (error.stdout) return error.stdout.toString().trim();
        return 'inactive';
    }
}

module.exports = {
    getServiceStatus: () => {
        const apps = [
            { id: "fail2ban", display: "Fail2Ban", service: "fail2ban.service" },
            { id: "nut-ups-server", display: "NUT UPS Server", service: "nut-server.service" },
            { id: "nut-ups-monitor", display: "NUT UPS Monitor", service: "nut-monitor.service" },
            { id: "automate-labels", display: "Automate Labels", service: "automate-labels.service" },
            { id: "langops-dashboard", display: "LangOps Dashboard", service: "langops_dashboard.service" }
        ];

        return apps.map(app => ({
            id: app.id,
            name: app.display,
            status: getServiceStatus(app.service)
        }));
    }
};