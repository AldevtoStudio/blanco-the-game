import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthenticationContext from '../../context/authentication';
import { profileLoad } from '../../services/profile';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthenticationContext);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileLoad(id).then((data) => {
      setProfile(data.user);
    });
  }, [id]);

  return (
    <div>
      {profile && (
        <div>
          <img src={profile.picture} alt={profile.name} />
          <h1>{profile.name}</h1>
        </div>
      )}
      {user?._id === id && <Link to='/profile/edit'>Edit Profile</Link>}
    </div>
  );
};

export default ProfilePage;
