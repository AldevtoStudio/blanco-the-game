class BlancoRoom {
  constructor(code, io) {
    this.code = code;
    this.io = io;
    this.players = [];
    this.current_turn = 0;
    this.timeOut;
    this._turn = 0;
    this.MAX_WAITING = 60000;
    this.firstTime = true;
    this.votedPlayers = [];
    this.isPlaying = false;
    this.wordsCount = 0;
  }

  getCode = () => {
    return this.code;
  };

  addWord = () => {
    this.wordsCount++;
    console.log(this.wordsCount);
  };

  resetWords = () => {
    this.wordsCount = 0;
  };

  addPlayer = (socket) => {
    if (!this.players.includes(socket)) this.players.push(socket);
  };

  removePlayer = (socket) => {
    if (!this.players.includes(socket)) return;

    this.players.splice(this.players.indexOf(socket), 1);
    this._turn--;
  };

  nextTurn = () => {
    this._turn = this.current_turn++ % this.players.length;

    let currentPlayer = this.players[this._turn];

    // Check if all players sent their related word.
    if (this.wordsCount === this.players.length) {
      this.io.to(this.code).emit('set_turn', {
        socketId: 'NULL'
      });

      setTimeout(() => this.io.to(this.code).emit('change_to_voting'), 3000);
    }

    // Check if all players voted.
    if (this.votedPlayers.length === this.players.length) {
      this.io.to(this.code).emit('set_turn', {
        socketId: 'NULL'
      });

      setTimeout(() => this.io.to(this.code).emit('change_to_ending'), 3000);
    }

    // If no wordsCount or votedPlayers, means we are playing, so we trigger the next turn.
    if (
      this.wordsCount <= this.players.length ||
      this.votedPlayers.length <= this.players.length
    ) {
      this.io.to(this.code).emit('set_turn', {
        socketId: currentPlayer.id
      });

      console.log(`Next turn triggered ${this._turn}`);
    }

    this.$triggerTimeout();
  };

  $triggerTimeout = () => {
    this.timeOut = setTimeout(() => {
      if (this.isPlaying) this.nextTurn();
      else this.$triggerTimeout();
    }, this.MAX_WAITING);
  };

  resetTimeOut = () => {
    if (typeof this.timeOut === 'object') {
      clearTimeout(this.timeOut);
      console.log('Timeout reset');
    }
  };
}

module.exports = BlancoRoom;
