import { useContext } from 'react';
import AuthenticationContext from '../../context/authentication';
import { Link, useNavigate } from 'react-router-dom';
import { signOutUser } from '../../services/authentication';
import './NavBar.scss';

const NavBar = () => {
  const { user, setUser } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser().then(() => {
      setUser(null);
      navigate('/');
    });
  };

  return (
    <nav>
      <Link to='/'>Home</Link>
      {(user && (
        <>
          <div>
            <Link to={`/profile/${user._id}`}>Profile</Link>
            <button onClick={handleSignOut}>Log Out</button>
          </div>
        </>
      )) || (
        <>
          <Link to='/log-in'>Log In</Link>
          <Link to='/register'>Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
