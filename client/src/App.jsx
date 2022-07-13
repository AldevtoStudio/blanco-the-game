import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import socketio from 'socket.io-client';

import NavBar from './components/NavBar';
import AuthenticationContext from './context/authentication';
import SocketContext from './context/socket';
import { loadUserInformation } from './services/authentication';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import GameController from './pages/Game/GameController';

const App = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    loadUserInformation().then((data) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    const newSocket = socketio(process.env.REACT_APP_REST_API_URL, {
      withCredentials: true
    });

    setSocket(newSocket);

    return () => socket?.disconnect();
  }, [user]);

  return (
    <AuthenticationContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/log-in' element={<LoginPage />} />
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/profile/edit' element={<ProfileEditPage />} />
            <Route path='/room/:code' element={<GameController />} />
            {/* <Route path='/theme/create' element={<AddThemePage />} /> */}
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export default App;
