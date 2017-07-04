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
    console.log('c', ws, null, " ");
    const parsed = Utils.parse(message);

    if (typeof parsed === 'string') {
      return console.error(parsed);
    }

    switch (parsed.type) {
      case 'connect' :
        return join(parsed.name, ws);
      case 'disconnect' :
        return leave(parsed.name);
      default :
        console.error('no such type ' + parsed.type);
    }
  });

  //send all the other clients on connect
  ws.send(
    JSON.stringify({
      type : 'broadcast',
      clients : JSON.stringify(Object.keys(clients))
    })
  );
});

/**
 *  Add client to list
 */
const join = (name, ws) => {
  clients[name] = ws;
  broadcast(name);
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
const broadcast = (notTo) => {
  const list = Object.keys(clients);

  list.forEach((name) => {
    if (name === notTo) {
      return;
    }

    sendMessageTo(name, {
      type: 'braodcast',
      clients:list
    });
  });
};

/**
 *  Send message to client
 */
const sendMessageTo = (name, message) => {
  clients[name].send(JSON.stringify(message));
}
