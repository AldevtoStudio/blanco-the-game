import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthenticationContext from '../../../context/authentication';
import SocketContext from '../../../context/socket';
import './Voting.scss';

const Voting = (props) => {
  const { room, isAdmin, onEnding, words, setEndGame } = props;
  const { code } = useParams();

  const socket = useContext(SocketContext);
  const { user } = useContext(AuthenticationContext);

  const [counter, setCounter] = useState(room.settings.votingTime);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0 && isAdmin) finishVoting();

    return () => clearInterval(timer);
  }, [counter]);

  // Go to ending screen if all players voted.
  useEffect(() => {
    socket?.on('change_to_ending', () => {
      if (!isAdmin) return;

      finishVoting();
    });

    return () => {
      socket?.off('change_to_ending');
    };
  }, []);

  // End or restart game if blanco was caught.
  useEffect(() => {
    socket?.on('end_game', (data) => {
      const { wasBlancoCaught } = data;

      onEnding('ENDING');
      setEndGame(wasBlancoCaught);
    });

    return () => {
      socket?.off('end_game');
    };
  }, []);

  const finishVoting = () => {
    if (!isAdmin) return;

    // Get most voted word.
    const sortedArr = words.sort((a, b) => a.votes < b.votes);
    let mostVotedWord = sortedArr[0];

    // Send mostVotedWord to server.
    socket?.emit('send_end_data', { mostVotedWord, roomCode: code });
  };

  // Send voted user with the related word voted data.
  const handleVote = (word, event) => {
    if (hasVoted) return;

    event.preventDefault();
    const { text, sender } = word;

    socket?.emit('send_votedPlayer', {
      votedPlayer: sender,
      votedBy: { name: user.name, picture: user.picture, _id: user._id },
      word: text,
      roomCode: code
    });

    // Disable all voting buttons.
    setHasVoted(true);
  };

  const listWords = () => {
    return words
      .sort((a, b) => a.text.localeCompare(b.text))
      .map((word) => {
        return (
          <div key={word.sender._id}>
            <p>{word.text}</p>
            <b>By: {word.sender.name}</b>
            <ul>
              {word.votedBy?.map((player) => (
                <li key={player._id}>{player.name}</li>
              ))}
            </ul>
            <li>Votes: {word.votes ? word.votes : '0'}</li>
            <button
              className='voting-button'
              onClick={(event) => handleVote(word, event)}
              disabled={hasVoted}
            >
              Vote
            </button>
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
