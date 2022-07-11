'use strict';

const express = require('express');
const routeGuard = require('./../middleware/route-guard');
const Theme = require('../models/theme');
const router = new express.Router();

//gets a random Theme
router.get('/random', (req, res, next) => {
  Theme.count()
    .then((count) => {
      let random = Math.floor(Math.random() * count);
      return Theme.findOne().skip(random);
    })
    .then((theme) => {
      res.json({ theme });
    })
    .catch((error) => {
      next(error);
    });
});

//creates a new Theme
router.post('/create', routeGuard, (req, res, next) => {
  const { theme } = req.body;
  Theme.create({
    name: theme
  })
    .then((theme) => {
      res.json({ theme });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
