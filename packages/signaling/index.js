var WebSocket = require("ws");
var WebSocketServer = require("ws").Server;
var cuid = require("cuid");

const TIMEOUT = 4 * 60000;

// Start websocket server
var server = new WebSocketServer({ port: 8088 });

var socketList = [];
var socketLookup = [];

var sockets = {};
var hosts = {};
var clients = {};

const getRandom = () =>
  Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

const registerHost = hostInfo => {
  console.log("Rgistering host", hostInfo);
  let code = getRandom();

  console.log("Host:: ", code);
  while (hosts[code]) {
    code = getRandom();
  }

  hosts[code] = hostInfo;

  setTimeout(() => {
    delete hosts[code];
  }, TIMEOUT);

  console.log("RETURNING CODE");
  return code;
};

server.on("connection", function(socket) {
  console.log("received connection");

  const socketId = cuid();

  sockets[socketId] = socket;

  socketList.push(socket);
  socketLookup.push(socketId);

  console.log("SENDING NAME", socketId);
  socket.send(JSON.stringify({ clientName: socketId }));

  socket.on("close", function() {
    const index = socketList.indexOf(socket);
    const key = socketLookup.splice(index, 1);
    socketList.splice(index, 1);

    if (clients[key]) {
      delete client[key];
    }
  });

  socket.on("message", function(message) {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type && parsedMessage.type === "HOST") {
      const code = registerHost(parsedMessage.socketName);
      this.send(JSON.stringify({ type: "HOST_KEY", accessCode: code }));
    }

    if (parsedMessage.type && parsedMessage.type === "CLIENT") {
      const code = parsedMessage.code;
      const hostInfo = hosts[code];

      // TODO: Ensure host is there
      this.send(
        JSON.stringify({ type: "HOST_CONNECTION_INFO", host: hostInfo })
      );
    }

    if (parsedMessage.action) {
      const { to, from, action, data } = parsedMessage;

      const hostSocket = sockets[to];

      if (!hostSocket) {
        return;
      }

      hostSocket.send(JSON.stringify({ type: action, data, from }));
    }

    // // TODO: do something to handle the logic for either
    // // registering a hash or returning the local connection info
    // sockets.forEach(
    //   socket => console.log("SENDING MESSAGE", message) || socket.send(message)
    // );
  });
});
