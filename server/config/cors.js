const corsOptions = {
  ...(process.env.CLIENT_APP_ORIGINS && {
    origin: process.env.CLIENT_APP_ORIGINS.split(',')
  }),
  credentials: true
};

module.exports = corsOptions;
