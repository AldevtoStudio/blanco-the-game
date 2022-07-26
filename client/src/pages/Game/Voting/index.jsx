import { useContext, useEffect, useState } from 'react';
import SocketContext from '../../../context/socket';
import './Voting.scss';

const Voting = (props) => {
  const { room, isAdmin, onEnding } = props;

  const socket = useContext(SocketContext);

  const [counter, setCounter] = useState(room.settings.votingTime);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    // TEST: Go to ending view if voting time is over.
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

  // TODO: VOTED PLAYERS STATE (but in GameController, not here).
  //
  // TODO: Send voted user with the related word voted data.
  const handleVote = () => {
    /* Data should look like: 
    let newVotedPlayer = {
      votedPlayer: { name: votedPlayer.name, picture: votedPlayer.picture, _id: votedPlayer._id }
      votedBy: { name: user.name, picture: user.picture, _id: user._id },
      word (word from words with sender and votedPlayer being the same): word.text
    } */
    //
    // Send newVotedPlayer to server so we can relay data to other clients.
    //
    // setVotedPlayers([...votedPlayers, newVotedPlayer]);
  };

  return <div>Voting | Time left: {counter}</div>;
};

export default Voting;
