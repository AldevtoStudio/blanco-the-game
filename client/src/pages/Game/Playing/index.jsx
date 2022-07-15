import { useContext } from 'react';
import AuthenticationContext from '../../../context/authentication';
import './Playing.scss';

const Playing = (props) => {
  const { room } = props;

  const { user } = useContext(AuthenticationContext);

  return (
    <div>
      Playing
      {(room.blancoUser === user._id && <p>You're Blanco! Try to guess the theme...</p>) || (
        <p>Write anything related to: {room.currentTheme.name}</p>
      )}
    </div>
  );
};

export default Playing;
