import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../../context/authentication';
import SocketContext from '../../../context/socket';
import { useParams } from 'react-router-dom';
import './Playing.scss';

const Playing = (props) => {
  const { room, words, onAllWordsSent } = props;
  const { code } = useParams();

  const socket = useContext(SocketContext);
  const { user } = useContext(AuthenticationContext);

  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    // Handle turns from server.
    socket?.on('set_turn', (data) => {
      const { socketId } = data;

      if (socketId === socket.id) setIsMyTurn(true);
      else setIsMyTurn(false);
    });

    socket?.on('change_to_voting', () => {
      onAllWordsSent('VOTING');
    });

    return () => {
      socket?.off('set_turn');
    };
  }, [socket]);

  const handleSendWord = (event) => {
    event.preventDefault();

    socket?.emit('send_word', {
      text: currentWord,
      sender: { name: user.name, picture: user.picture, _id: user._id },
      roomCode: code
    });

    socket?.emit('pass_turn');
  };

  return (
    <div>
      {(isMyTurn && (
        <div>
          <h2>
            {(room.blancoUser === user?._id && <p>You're Blanco! Try to guess the theme...</p>) || (
              <p>Write anything related to: {room.currentTheme.name}</p>
            )}
          </h2>
          <form onSubmit={handleSendWord}>
            <label htmlFor='relatedWord'>Related word</label>
            <input
              id='relatedWord'
              name='relatedWord'
              onChange={(event) => setCurrentWord(event.target.value)}
            />
            <button>Send</button>
          </form>
        </div>
      )) || <h2>Wait for your turn...</h2>}

      <div>
        <h2>Words written:</h2>
        <ul>
          {words.map((word, index) => (
            <li key={word.text + index}>
              {word.text} by {word.sender.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playing;
