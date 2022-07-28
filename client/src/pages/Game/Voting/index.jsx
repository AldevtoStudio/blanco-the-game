import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthenticationContext from '../../../context/authentication';
import SocketContext from '../../../context/socket';
import './Voting.scss';

const Voting = (props) => {
  const { room, isAdmin, onEnding, votedPlayers, setVotedPlayers, words } = props;
  const { code } = useParams();

  const socket = useContext(SocketContext);
  const { user } = useContext(AuthenticationContext);

  const [counter, setCounter] = useState(room.settings.votingTime);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0 && isAdmin) onEnding('ENDING');

    return () => clearInterval(timer);
  }, [counter]);

  // TEST: Go to ending screen if all players voted.
  useEffect(() => {
    socket?.on('change_to_ending', () => {
      if (!isAdmin) return;

      onEnding('ENDING');
    });

    return () => {
      socket?.off('change_to_ending');
    };
  }, []);

  // Send voted user with the related word voted data.
  const handleVote = (word) => {
    const { text, sender } = word;

    console.log(`Player: ${sender.name} voted!`);

    socket?.emit('send_votedPlayer', {
      votedPlayer: sender,
      votedBy: { name: user.name, picture: user.picture, _id: user._id },
      word: text,
      roomCode: code
    });
  };

  const listWords = () => {
    return words.map((word) => {
      return (
        <div key={word.sender._id}>
          <p>{word.text}</p>
          <b>By: {word.sender.name}</b>
          <button onClick={() => handleVote(word)}>Vote</button>
        </div>
      );
    });
  };

  return (
    <div>
      Voting | Time left: {counter}
      <div>{listWords()}</div>
    </div>
  );
};

export default Voting;
