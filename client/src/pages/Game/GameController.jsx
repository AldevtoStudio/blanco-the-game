import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomByCode } from '../../services/room';
import SocketContext from '../../context/socket';
import AuthenticationContext from '../../context/authentication';
import Lobby from './Lobby';

const GameController = () => {
  const { code } = useParams();

  const socket = useContext(SocketContext);
  const { user } = useContext(AuthenticationContext);

  const [room, setRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
      const { room } = data;

      setRoom(room);
      setIsAdmin(user?._id === room.admin);
    });
  }, [code, user]);

  // Update player list on 'update_player_list' event.
  // This event is sent from the server when any player joins/leaves the current room.
  useEffect(() => {
    socket?.on('update_player_list', (data) => {
      const { currentPlayers } = data;

      setRoom({ ...room, currentPlayers });
    });

    return () => {
      socket?.off('update_player_list');
    };
  }, [room, socket]);

  // Display corresponding game page based on 'room.status'.
  switch (room?.status) {
    case 'WAITING':
      return <Lobby room={room} setRoom={setRoom} isAdmin={isAdmin} />;

    default:
      return <div>Loading...</div>;
  }
};

export default GameController;
