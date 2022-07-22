import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomByCode, updateRoomByCode } from '../../services/room';
import SocketContext from '../../context/socket';
import AuthenticationContext from '../../context/authentication';

import Lobby from './Lobby';
import Starting from './Starting';
import Playing from './Playing';
import Voting from './Voting';

const GameController = () => {
  const { code } = useParams();

  const socket = useContext(SocketContext);
  const { user } = useContext(AuthenticationContext);

  const [room, setRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [words, setWords] = useState([]);

  // Send 'join_room' event when joining a room.
  // Send 'leave_room' event when navigating, refreshing or closing the page.
  useEffect(() => {
    socket?.emit('join_room', { code });

    return () => {
      socket?.emit('leave_room', { code });
    };
  }, [code, socket]);

  // Set the room and isAdmin states.
  useEffect(() => {
    getRoomByCode(code).then((data) => {
      setRoom(data.room);
      setIsAdmin(user?._id === data.room.admin);
    });
  }, [code, user]);

  // Update player list on 'update_player_list' event.
  // This event is sent from the server when any player joins/leaves the current room.
  useEffect(() => {
    socket?.on('update_player_list', (data) => {
      const { currentPlayers } = data;

      setRoom({ ...room, currentPlayers });
    });

    socket?.on('room_updated_server', (data) => {
      const { status, currentTheme, blancoUser } = data;

      setRoom({ ...room, status, currentTheme, blancoUser });
    });

    return () => {
      socket?.off('update_player_list');
    };
  }, [room, socket]);

  // Set words list.
  useEffect(() => {
    socket?.on('new_word', (data) => {
      const { text, sender } = data;

      let newWord = { text, sender };

      setWords([...words, newWord]);
    });

    return () => {
      socket?.off('new_word');
    };
  }, [socket, words]);

  // Update room status.
  const updateRoomStatus = (newStatus, newTheme, newBlancoUser) => {
    if (!isAdmin) return;

    updateRoomByCode(code, {
      ...room,
      currentTheme: newTheme ? newTheme : room.currentTheme,
      blancoUser: newBlancoUser ? newBlancoUser : room.blancoUser,
      status: newStatus
    }).then((data) => {
      setRoom(data.room);

      // Reset words array.
      if (data.room.status === 'ENDING') {
        socket?.emit('reset_words', { code });
        setWords([]);
      }

      socket.emit('room_updated', { room: data.room });
    });
  };

  // Display corresponding game page based on 'room.status'.
  switch (room?.status) {
    case 'WAITING':
      return <Lobby room={room} setRoom={setRoom} isAdmin={isAdmin} onStart={updateRoomStatus} />;
    case 'STARTING':
      return <Starting room={room} isAdmin={isAdmin} onCountdownEnd={updateRoomStatus} />;
    case 'PLAYING':
      return <Playing room={room} words={words} onAllWordsSent={updateRoomStatus} />;
    case 'VOTING':
      return <Voting />;

    default:
      return <div>Loading...</div>;
  }
};

export default GameController;
