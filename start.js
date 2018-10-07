var shell = require("shelljs");

shell.exec("node packages/signaling/index.js", { async: true });
shell.exec("cd packages/client && npm start", { async: true });

console.log("Started both apps");
