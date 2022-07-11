'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
    trim: true,
    required: true
  }
});

const Theme = mongoose.model('Theme', schema);

module.exports = Theme;
