import { useState } from 'react';
import { useEffect } from 'react';
import { listRooms } from '../../services/room';
import { Link } from 'react-router-dom';
import './RoomList.scss';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    listRooms().then((data) => {
      const { rooms } = data;
      setRooms(rooms);
    });
  }, []);

  const displayRooms = () => {
    return rooms.map((room) => {
      return (
        <Link key={room._id} to={`/room/${room.code}`}>
          <b>{room.name}</b>
          <ul>
            {room.currentPlayers.map((player) => (
              <li key={player._id}>{player.name}</li>
            ))}
          </ul>
        </Link>
      );
    });
  };

  return (
    <div>
      <h2>Room List:</h2>
      {displayRooms()}
    </div>
  );
};

export default RoomList;
