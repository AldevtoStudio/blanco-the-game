const BlancoRoom = require('../game/rooms');

class Game {
  constructor() {
    this.rooms = [];
  }

  createRoom = (data, io) => {
    const { roomData } = data;

    let room = new BlancoRoom(roomData.code, io);

    this.rooms.push(room);
  };
}

module.exports = Game;
