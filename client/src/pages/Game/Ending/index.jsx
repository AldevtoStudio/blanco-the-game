import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../../context/authentication';
import './Ending.scss';

const Ending = (props) => {
  const { endGame, isAdmin, onCountdownEnd, room } = props;

  const { user } = useContext(AuthenticationContext);

  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0 && isAdmin) onCountdownEnd(endGame ? 'WAITING' : 'PLAYING');

    return () => clearInterval(timer);
  }, [counter]);

  if (endGame) {
    return (
      <div>
        {(room.blancoUser === user._id && (
          <h1>Damn you got caught... better luck next time!</h1>
        )) || <h1>You got the Blanco, you won!</h1>}
        <div>Ending game in: {counter}</div>
      </div>
    );
  } else {
    return (
      <div>
        {(room.blancoUser === user._id && <h1>You survived another round</h1>) || (
          <h1>You still didn't get the blanco...</h1>
        )}
        <div>Next round begins in: {counter}</div>
      </div>
    );
  }
};

export default Ending;
