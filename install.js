var shell = require("shelljs");

shell.exec("cd packages/signaling && npm install", { async: true });
shell.exec("cd packages/client && npm install", { async: true });
