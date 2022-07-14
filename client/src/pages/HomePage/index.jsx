import RoomList from '../../components/RoomList';
import CreateRoomForm from './../../components/CreateRoomForm';
import './HomePage.scss';

const HomePage = () => {
  return (
    <div>
      <CreateRoomForm />
      <RoomList />
    </div>
  );
};

export default HomePage;
