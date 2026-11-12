const os = require("os");

const getNetworkIP = () => {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const network of interfaces[name]) {
            if (
                network.family === "IPv4" &&
                !network.internal
            ) {
                return network.address;
            }
        }
    }

    return "Not Found";
};

const getPublicIP = async () => {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();

        return data.ip;
    } catch (error) {
        return "Not Available";
    }
};

const startServer = async (app , port) => {
    const networkIP = getNetworkIP();
    const publicIP = await getPublicIP();

    app.listen(port, "0.0.0.0", () => {
        console.log(`Local Device : http://localhost:${port}`);
        console.log(`Local Network : http://${networkIP}:${port}`);
        console.log(`Internet IP : http://${publicIP}:${port}`);
    });
};

module.exports = startServer;