import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationContext from '../../context/authentication';
import { profileLoad, profileEdit } from '../../services/profile';
import { IKContext, IKUpload } from 'imagekitio-react';
import './ProfileEditPage.scss';

const ProfileEditPage = () => {
  const { user, setUser } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    profileLoad(user._id).then((data) => {
      setProfile(data.user);
    });
  }, [user]);

  const handleProfileEdit = (event) => {
    event.preventDefault();

    profileEdit(profile).then((data) => {
      setUser(data.profile);
      navigate(`/profile/${data.profile._id}`);
    });
  };

  const handleSuccess = (result) => {
    const { url } = result;

    setProfile({ ...profile, picture: url });
  };

  const handleError = (error) => {
    console.log(error);
  };

  return (
    <div>
      {profile && (
        <form onSubmit={handleProfileEdit}>
          <label htmlFor='input-name'>Username</label>
          <input
            id='input-name'
            placeholder={profile.name}
            onChange={(event) => {
              setProfile({ ...profile, name: event.target.value });
            }}
          />

          <label htmlFor='input-name'>E-Mail</label>
          <input
            id='input-name'
            placeholder={profile.email}
            onChange={(event) => {
              setProfile({ ...profile, email: event.target.value });
            }}
          />

          {profile.picture && <img src={profile.picture} alt={profile.name} />}

          <IKContext
            publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_API_KEY}
            authenticationEndpoint={process.env.REACT_APP_IMAGEKIT_AUTH_ENDPOINT}
            urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
          >
            <IKUpload onSuccess={handleSuccess} onError={handleError} />
          </IKContext>

          <button>Save</button>
        </form>
      )}
    </div>
  );
};

export default ProfileEditPage;
