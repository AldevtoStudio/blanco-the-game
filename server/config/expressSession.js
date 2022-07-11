const connectMongo = require('connect-mongo');

const expressSessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  proxy: true,
  proxy: true,
  cookie: {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
    secure: process.env.NODE_ENV === 'production'
  },
  store: connectMongo.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60
  })
};

module.exports = expressSessionOptions;
