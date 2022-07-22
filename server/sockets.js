const debug = require('debug')('blanco-server:socketio');
const Room = require('./models/room');
const Game = require('./game/game');
const BlancoGame = new Game();

const setSockets = (io) => {
  io.on('connection', (socket) => {
    const { user } = socket.request;
    let blancoRoom;
    debug(`Client with ID: ${socket.id} connected`);

    // PASS TURN EVENT
    socket.on('pass_turn', () => {
      if (blancoRoom.players[blancoRoom._turn] !== socket) return;

      console.log('Next turn triggered.');

      blancoRoom.resetTimeOut();
      blancoRoom.nextTurn();
    });

    socket.on('room_updated', (data) => {
      const { room } = data;

      if (room.status === 'PLAYING') {
        // Start turn system.
        blancoRoom.isPlaying = true;

        blancoRoom.resetTimeOut();
        blancoRoom.nextTurn();

        console.log('Turn system started.');
      } else blancoRoom.isPlaying = false;

      io.to(room.code).emit('room_updated_server', {
        status: room.status,
        currentTheme: room.currentTheme,
        blancoUser: room.blancoUser
      });
    });

    socket.on('create_room', (data) => {
      BlancoGame.createRoom(data, io);
    });

    socket.on('send_word', (data) => {
      const { text, sender, roomCode } = data;

      BlancoGame.rooms.map((room) => {
        if (room.getCode() !== roomCode) return;

        blancoRoom = room;
      });

      blancoRoom?.addWord();

      io.to(roomCode).emit('new_word', {
        text,
        sender
      });
    });

    socket.on('reset_words', (data) => {
      const { code } = data;

      BlancoGame.rooms.map((room) => {
        if (room.getCode() !== code) return;

        blancoRoom = room;
      });

      blancoRoom.resetWords();
    });

    socket.on('join_room', (data) => {
      const { code } = data;

      BlancoGame.rooms.map((room) => {
        if (room.getCode() !== code) return;

        blancoRoom = room;
      });

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
          blancoRoom.addPlayer(socket);
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

      BlancoGame.rooms.map((room) => {
        if (room.getCode() !== code) return;

        blancoRoom = room;
      });

      Room.findOneAndUpdate(
        { code },
        { $pull: { currentPlayers: user._id } },
        { new: true }
      )
        .populate('currentPlayers')
        .then((room) => {
          blancoRoom.removePlayer(socket);
          debug(`${user.name} left ${room.name}'s room.`);

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

            BlancoGame.rooms.map((_room) => {
              if (_room.getCode() !== room.code) return;

              _room.removePlayer(socket);
            });
          });
        })
        .catch((error) => console.log(error));
    };
  });
};

module.exports = setSockets;
