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
        const apps = {
            "Fail2Ban": "fail2ban.service",
            "NUT-UPS-Server": "nut-server.service",
            "NUT-UPS-Monitor": "nut-monitor.service",
            "Automate-Labels": "automate-labels.service",
            "LangOps-Dashboard": "langops_dashboard.service"
        };

        return Object.keys(apps).map(friendlyName => ({
            name: friendlyName,
            status: getServiceStatus(apps[friendlyName])
        }));
    }
};