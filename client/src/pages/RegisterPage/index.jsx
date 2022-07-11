import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationContext from '../../context/authentication';
import { registerUser } from '../../services/authentication';
import { IKContext, IKUpload } from 'imagekitio-react';
import './RegisterPage.scss';

const RegisterPage = () => {
  const { setUser } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [picture, setPicture] = useState(
    'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'
  );

  const handleRegistration = (event) => {
    event.preventDefault();

    registerUser({ name, email, password, picture }).then((data) => {
      setUser(data.user);
      navigate('/');
    });
  };

  const handleSuccess = (result) => {
    const { url } = result;

    console.log(url);
    setPicture(url);
  };

  const handleError = (error) => {
    console.log(error);
    setPicture('');
  };

  return (
    <div>
      <form onSubmit={handleRegistration}>
        <label htmlFor='input-name'>Name</label>
        <input
          id='input-name'
          placeholder='Name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor='input-email'>Email</label>
        <input
          id='input-email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor='input-password'>Password</label>
        <input
          id='input-password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {picture && <img style={{ maxWidth: '20em' }} src={picture} alt='Selected' />}
        <IKContext
          publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_API_KEY}
          authenticationEndpoint={process.env.REACT_APP_IMAGEKIT_AUTH_ENDPOINT}
          urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
        >
          <IKUpload onSuccess={handleSuccess} onError={handleError} />
        </IKContext>

        <button>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
