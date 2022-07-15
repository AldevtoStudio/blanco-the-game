import { useParams } from 'react-router-dom';
import { selectRandomBlanco, updateRoomByCode } from '../../../services/room';
import { getTheme } from '../../../services/theme';
import './Lobby.scss';

const Lobby = (props) => {
  const { room, setRoom, isAdmin, onStart } = props;
  const { code } = useParams();

  // Handle new room settings when clicking 'Save' button.
  const handleChangeSettings = (event) => {
    event.preventDefault();

    // Getting all inputs.
    const [
      name,
      isPublic,
      language,
      votingTime,
      writingTime,
      minPlayers,
      changeTheme,
      hideUserNames,
      anonymousVotes
    ] = event.target.querySelectorAll('input');

    // Creating new room body.
    const newRoom = {
      name: name.value,
      isPublic: isPublic.checked,
      language: language.value,
      settings: {
        votingTime: votingTime.value,
        writingTime: writingTime.value,
        minPlayers: minPlayers.value,
        changeTheme: changeTheme.checked,
        hideUserNames: hideUserNames.checked,
        anonymousVotes: anonymousVotes.checked
      }
    };

    // Sending new room body to server via API request.
    updateRoomByCode(code, { ...room, ...newRoom }).then((data) => {
      // Getting server response.
      const { room } = data;

      // Updating room state.
      setRoom(room);
    });
  };

  // Display current room players.
  const listCurrentUsers = () => {
    return room.currentPlayers.map((player) => {
      return (
        <div key={player._id}>
          <img src={player.picture} alt={player.name} />
          {player.name}
        </div>
      );
    });
  };

  const startPlaying = () => {
    let blancoUser;
    let currentTheme;

    selectRandomBlanco(code)
      .then((data) => {
        blancoUser = data.blancoUser;

        return getTheme();
      })
      .then((data) => {
        currentTheme = data.theme;

        updateRoomByCode(code, {
          ...room,
          blancoUser: blancoUser._id,
          currentTheme: currentTheme._id
        }).then((data) => {
          setRoom(data.room);
          onStart('STARTING', currentTheme, blancoUser);
        });
      });
  };

  return (
    <div>
      <h1>{room.name}'s Lobby</h1>
      <b>Room Code:</b> <span>{room.code}</span>
      {isAdmin && (
        <>
          <div>
            <h2>Settings</h2>
            <form onSubmit={handleChangeSettings}>
              <label htmlFor='roomName'>Room Name</label>
              <input id='roomName' name='name' defaultValue={room.name} />
              <br />
              <label htmlFor='roomIsPublic'>Public</label>
              <input
                type='checkbox'
                id='roomIsPublic'
                name='isPublic'
                defaultChecked={room.isPublic}
              />
              <br />
              <label htmlFor='roomLang'>Room Language</label>
              <input id='roomLang' name='language' defaultValue={room.language} />
              <br />
              <label htmlFor=''>Voting Time</label>
              <input type='number' defaultValue={room.settings.votingTime} name='votingTime' />
              <br />
              <label htmlFor=''>Writing Time</label>
              <input type='number' defaultValue={room.settings.writingTime} name='writingTime' />
              <br />
              <label htmlFor=''>Minimum Players</label>
              <input type='number' defaultValue={room.settings.minPlayers} name='minPlayers' />
              <br />
              <label htmlFor=''>Change theme each new round</label>
              <input
                type='checkbox'
                defaultChecked={room.settings.changeTheme}
                name='changeTheme'
              />
              <br />
              <label htmlFor=''>Hide Usernames</label>
              <input
                type='checkbox'
                defaultChecked={room.settings.hideUserNames}
                name='hideUserNames'
              />
              <br />
              <label htmlFor=''>Anonymous Votes</label>
              <input
                type='checkbox'
                defaultChecked={room.settings.anonymousVotes}
                name='anonymousVotes'
              />
              <br />
              <button>Save</button>
            </form>
          </div>
          <div>
            <button onClick={startPlaying}>Start Game</button>
          </div>
        </>
      )}
      <div>
        <h2>Players</h2>
        <div>{listCurrentUsers()}</div>
      </div>
    </div>
  );
};

export default Lobby;
