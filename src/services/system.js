import os from "os";

const SystemService = {
hostname: os.hostname(),
platform: os.platform(),
release: os.release(),
cpus: os.cpus(),
freemem: os.freemem(),
totalmem: os.totalmem(),
uptime: process.uptime(),
};

export {SystemService};