'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const Room = require('./../models/room');

const createRoomCode = () => {
  var code = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
};

// GET to ‘/’ - Lists rooms.
router.get('/', routeGuard, (req, res, next) => {
  Room.find({ isPublic: true })
    .populate('currentPlayers')
    .then((rooms) => {
      res.json({ rooms });
    })
    .catch((error) => {
      next(error);
    });
});

// GET to ‘/:code’ - Get room with code.
router.get('/:code', routeGuard, (req, res, next) => {
  const { code } = req.params;

  Room.findOne({ code })
    .populate('currentPlayers')
    .populate('currentTheme')
    .then((room) => {
      res.json({ room });
    })
    .catch((error) => {
      next(error);
    });
});

// GET to ‘/:code’ - Get room with code.
router.get(`/:code/random-blanco`, routeGuard, (req, res, next) => {
  const { code } = req.params;

  Room.findOne({ code })
    .populate('currentPlayers')
    .populate('currentTheme')
    .then((room) => {
      let blancoUser =
        room.currentPlayers[
          Math.floor(Math.random() * room.currentPlayers.length)
        ];

      res.json({ blancoUser });
    })
    .catch((error) => {
      next(error);
    });
});

// POST to ‘/create’ - Creates a new room.
router.post('/create', routeGuard, (req, res, next) => {
  const admin = req.user._id;
  const { name, isPublic, language, externalCom } = req.body;

  Room.create({
    admin,
    name,
    code: createRoomCode(),
    isPublic,
    language,
    externalCom
  })
    .then((room) => {
      res.json({ room });
    })
    .catch((error) => {
      next(error);
    });
});

// PATCH to ‘/:code’ - Updates room.
router.patch('/:code', routeGuard, (req, res, next) => {
  const { code } = req.params;
  const admin = req.user._id;
  const {
    name,
    isPublic,
    language,
    externalCom,
    settings,
    status,
    currentTheme,
    blancoUser
  } = req.body;

  Room.findOneAndUpdate(
    { code, admin },
    {
      admin,
      name,
      isPublic,
      language,
      externalCom,
      settings,
      status,
      currentTheme,
      blancoUser
    },
    { new: true }
  )
    .populate('currentPlayers')
    .populate('currentTheme')
    .then((room) => {
      res.json({ room });
    })
    .catch((error) => {
      next(error);
    });
});

// DETELE to ‘/:id’ - Removes room.
router.delete('/:code', routeGuard, (req, res, next) => {
  const { code } = req.params;
  const admin = req.user._id;

  Room.findOneAndDelete({ code, admin })
    .then(() => {
      res.json({});
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
