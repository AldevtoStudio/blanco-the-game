const debug = require('debug')('blanco-server:socketio');
const Room = require('./models/room');
const Game = require('./game');

const setSockets = (io) => {
  let BlancoGame = new Game();

  io.on('connection', (socket) => {
    const { user } = socket.request;
    debug(`Client with ID: ${socket.id} connected`);

    // PASS TURN EVENT
    socket.on('pass_turn', () => {
      if (BlancoGame.players[BlancoGame._turn] !== socket) return;

      console.log('Next turn triggered');

      BlancoGame.resetTimeOut();
      BlancoGame.nextTurn();
    });

    socket.on('join_room', (data) => {
      const { code } = data;

      leaveAllRooms(user?._id)
        .then(() => {
          return Room.findOne({ code }).populate('currentPlayers');
        })
        .then((room) => {
          const { currentPlayers } = room;

          if (!currentPlayers.includes(user)) {
            return Room.findOneAndUpdate(
              { code },
              { $addToSet: { currentPlayers: user._id } },
              { new: true }
            ).populate('currentPlayers');
          }
        })
        .then((room) => {
          socket.join(code);
          BlancoGame.addPlayer(socket);
          debug(`${user.name} connected to ${room.name}'s room.`);

          // Send update playerList event.
          io.to(code).emit('update_player_list', {
            currentPlayers: room.currentPlayers
          });
        })
        .catch((error) => console.log(error));
    });

    // LEAVE ROOM EVENT.
    socket.on('leave_room', (data) => {
      const { code } = data;

      Room.findOneAndUpdate(
        { code },
        { $pull: { currentPlayers: user._id } },
        { new: true }
      )
        .populate('currentPlayers')
        .then((room) => {
          console.log('Room updated');

          BlancoGame.removePlayer(socket);

          // Send update playerList event.
          io.to(code).emit('update_player_list', {
            currentPlayers: room.currentPlayers
          });
        })
        .catch((error) => console.log(error));
    });

    // DISCONNECTING EVENT.
    socket.on('disconnecting', () => leaveAllRooms(user?._id));

    // DISCONNECT EVENT.
    socket.on('disconnect', () => {
      debug(`Client with ID: ${socket.id} disconnected`);
    });

    const leaveAllRooms = async (userId) => {
      return Room.find({ currentPlayers: userId })
        .then((rooms) => {
          let promises = rooms.map((room) =>
            Room.findByIdAndUpdate(
              room._id,
              { $pull: { currentPlayers: userId } },
              { new: true }
            )
              .populate('currentPlayers')
              .exec()
          );

          return Promise.all(promises);
        })
        .then((rooms) => {
          rooms.forEach((room) => {
            // Send update playerList event.
            io.to(room.code).emit('update_player_list', {
              currentPlayers: room.currentPlayers
            });
          });
        })
        .catch((error) => console.log(error));
    };
  });
};

module.exports = setSockets;
