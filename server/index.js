const Utils = require('./lib/utils');
const WebSocket = require('ws');

let clients = {};

const Ws = new WebSocket.Server({
  port: 1337
});

/**
 *  When a client connects, open a new socket
 */
Ws.on('connection', (ws) => {
  ws.on('close', () => {
    filterLeft();
  });

  ws.on('message', (message) => {
    const parsed = Utils.parse(message);

    if (typeof parsed === 'string') {
      return console.error(parsed);
    }

    switch (parsed.type) {
      case 'connect' :
        return join(parsed.name, ws);
      case 'disconnect' :
        return leave(parsed.name);
      case 'private-message' :
        console.log('here', message);
        return sendMessageTo(parsed.to, parsed);
      default :
        console.error('no such type ' + parsed.type);
    }
  });

  //send all existing other clients on connect
  //we dont know the name yet so we can not add to clients
  ws.send(
    JSON.stringify({
      type : 'broadcast',
      clients : Object.keys(clients)
    })
  );
});

/**
 *  Add client to list
 */
const join = (name, ws) => {
  clients[name] = ws;
  broadcast();
};

/**
 *  Remove client
 */
const filterLeft = () => {
  Object.keys(clients).forEach((name) => {
    if (clients[name]._finalizeCalled) {
      delete clients[name];
    }
  });

  broadcast();
};

/**
 *  Broadcast to everyone
 */
const broadcast = () => {
  const list = Object.keys(clients);

  list.forEach((name) => {
    sendMessageTo(name, {
      type: 'broadcast',
      clients:list
    });
  });
};

/**
 *  Send message to client
 */
const sendMessageTo = (to, message) => {
  clients[to].send(JSON.stringify(message));
}
