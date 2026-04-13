const os = require("node:os");

const INTERFACE_FAMILIES = ["IPv4"];

module.exports = function() {
    return Object.values(os.networkInterfaces()).flat().filter(interface => {
        return interface.internal === false && INTERFACE_FAMILIES.includes(interface.family);
    }).map(interface => interface.address);
};