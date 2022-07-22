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

  voteForPlayer = (socket) => {
    this.votedPlayers.push(socket);
  };

  checkMostVotedPlayer = () => {
    if (!this.votedPlayers) {
      // Send no one eliminated.
      return;
    }

    let mostVotedPlayer = this.getMostRepeated();
    mostVotedPlayer.emit('set_spectator');

    this.votedPlayers = [];
  };

  getMostRepeated = () => {
    if (this.votedPlayers.length === 1) return this.votedPlayers[0];

    this.votedPlayers.sort();

    let max = 0,
      result,
      freq = 0;

    for (let i = 0; i < this.votedPlayers.length; i++) {
      if (this.votedPlayers[i] === this.votedPlayers[i + 1]) freq++;
      else freq = 0;

      if (freq > max) {
        result = this.votedPlayers[i];
        max = freq;
      }
    }

    return result;
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

    if (this.wordsCount === this.players.length) {
      this.io.to(this.code).emit('set_turn', {
        socketId: 'NULL'
      });

      setTimeout(() => this.io.to(this.code).emit('change_to_voting'), 3000);
    } else {
      this.io.to(this.code).emit('set_turn', {
        socketId: currentPlayer.id
      });
    }

    console.log(`Next turn triggered ${this._turn}`);

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
