const BlancoRoom = require('../game/rooms');

class Game {
  constructor() {
    this.rooms = [];
  }

  createRoom = (data) => {
    const { roomData } = data;

    let room = new BlancoRoom(roomData.code);

    this.rooms.push(room);
  };
}

module.exports = Game;
