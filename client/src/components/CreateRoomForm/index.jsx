import { useContext } from 'react';
import AuthenticationContext from './../../context/authentication';
import SocketContext from '../../context/socket';
import { createRoom } from '../../services/room';
import { useNavigate } from 'react-router-dom';
import './CreateRoomForm.scss';

const CreateRoomForm = () => {
  const socket = useContext(SocketContext);

  const navigate = useNavigate();

  const handleRoomCreation = (event) => {
    event.preventDefault();

    const [name] = event.target.querySelectorAll('input');
    const [language] = event.target.querySelectorAll('select');

    const roomBody = {
      name: name.value,
      language: language.value
    };

    createRoom(roomBody).then((data) => {
      const { room } = data;

      socket.emit('create_room', { roomData: room });
      navigate(`/room/${room.code}`);
    });
  };

  return (
    <div>
      <h2>Create Room</h2>
      <form onSubmit={handleRoomCreation}>
        <label htmlFor='roomName'>Name</label>
        <input id='roomName' name='name' />

        <select id='roomLanguages' name='language'>
          <option value='EN'>🇬🇧</option>
          <option value='ES'>🇪🇸</option>
        </select>

        <button>Create</button>
      </form>
    </div>
  );
};

export default CreateRoomForm;
