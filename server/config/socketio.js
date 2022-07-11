const expressSession = require('express-session');
const basicAuthenticationDeserializer = require('../middleware/basic-authentication-deserializer');
const socketIo = require('socket.io');
const expressSessionOptions = require('./expressSession');
const corsOptions = require('./cors');
const setSockets = require('../sockets');

const convertMiddleware = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

const socketIoOptions = { cors: corsOptions };

const setSocketIO = (server) => {
  const io = socketIo(server, socketIoOptions);

  io.use(convertMiddleware(expressSession(expressSessionOptions)));
  io.use(convertMiddleware(basicAuthenticationDeserializer));

  setSockets(io);
};

module.exports = setSocketIO;
