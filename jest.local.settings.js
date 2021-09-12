const config = require('./local.settings.json');

Object.keys(config.Values).forEach((key) => {
  process.env[key] = config.Values[key];
});
