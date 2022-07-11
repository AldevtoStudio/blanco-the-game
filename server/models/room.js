'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    lowercase: true,
    required: true,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['WAITING', 'STARTING', 'PLAYING', 'VOTING', 'ENDING'],
    default: 'WAITING'
  },
  language: {
    type: String,
    default: 'English'
  },
  //link to external Chats like Discord
  externalCom: [
    {
      type: String
    }
  ],
  currentPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  blancoUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentTypingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentTheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme'
  },
  settings: {
    votingTime: { type: Number, min: 10, max: 60, default: 15 },
    writingTime: { type: Number, min: 5, max: 20, default: 10 },
    minPlayers: { type: Number, min: 4, max: 12, default: 6 },
    changeTheme: { type: Boolean, default: false },
    hideUserNames: { type: Boolean, default: false },
    anonymousRounds: { type: Boolean, default: false }
  }
});

const Room = mongoose.model('Room', schema);

module.exports = Room;
