const { execSync } = require('child_process');

function getServiceStatus(serviceName) {
    try {
        const status = execSync(`systemctl is-active ${serviceName}`).toString().trim();
        return status;
    } catch (error) {
        return error.stdout ? error.stdout.toString().trim() : 'inactive';
    }
}

const services = {
    "Fail2Ban": "fail2ban.service",
    "NUT UPS Server": "nut-server.service",
    "NUT UPS Monitor": "nut-monitor.service",
    "Automate Labels": "automate-labels.service",
    "LangOps Dashboard": "langops_dashboard.service"
}

const report = Object.keys(services).map(friendlyName => {
    return {
        name: friendlyName,
        status: getServiceStatus(services[friendlyName])
    };
});