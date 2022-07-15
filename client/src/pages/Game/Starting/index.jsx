import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthenticationContext from '../../../context/authentication.js';
import './Starting.scss';

const Starting = (props) => {
  const { room, setRoom, isAdmin, onCountdownEnd } = props;
  const { code } = useParams();

  const { user } = useContext(AuthenticationContext);

  const [counter, setCounter] = useState(10);

  // Third Attempts
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0) onCountdownEnd('PLAYING');

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div>
      Starting in: {counter}{' '}
      {(room.blancoUser === user._id && <p>You're Blanco!</p>) || (
        <p>Theme: {room.currentTheme.name}</p>
      )}
    </div>
  );
};

export default Starting;
