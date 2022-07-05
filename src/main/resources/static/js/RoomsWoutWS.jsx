function getFetchRoomsURL() {
  return window.location.href + "/rooms";
}

function getSendRoomURL() {
  console.log(window.location.href);
  return window.location.href + "/rooms";
}

function goToRelative(url) {
  window.open(url, "_blank");
}

async function fetchRooms() {
  console.log("fetchRooms");
  const response = await fetch(getFetchRoomsURL());
  if (response.status === 200) {
    const data = await response.text();
    console.log("fetchRooms", JSON.parse(data));
    return JSON.parse(data);
  }
}

async function sendRoom(room) {
  console.log("sendRoom - JSON.stringify(room) = ", JSON.stringify(room));
  console.log("sendRoom - room = ", room);
  return fetch(getSendRoomURL(), {
    method: "POST",
    body: JSON.stringify(room),
  });
}

class RoomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: "",
      rooms: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.updateRooms();
    this.timerID = setInterval(() => this.updateRooms(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleChange(evt) {
    console.log("On handleChange - ", evt);
    this.setState({ roomName: evt.target.value });
  }

  handleSubmit(evt) {
    console.log("On handleSubmit - ", evt);
    let room = { name: this.state.roomName };
    sendRoom(room);
    evt.preventDefault();
    this.setState({ roomName: "" });
  }

  updateRooms() {
    console.log("On updateRooms");
    fetchRooms().then((updatedRooms) => {
      console.log("On updatedRooms - response = ", updatedRooms);
      if (updatedRooms.length != this.state.rooms.length) {
        console.log("On updatedRooms - if");
        this.setState({ rooms: updatedRooms });
      }
    });
  }

  render() {
    console.log("On render");
    return (
      <div>
        <p>Salas activas: {this.state.rooms.length}</p>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            value={this.state.roomName}
            onChange={this.handleChange}
            required
          />
          <input type="submit" value="Create room" />
        </form>
        <hr />
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Players</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.rooms.map((v, k) => {
              let roomURL = "/" + v.name;
              return (
                <tr key={k}>
                  <td>{k + 1}</td>
                  <td>{v.name}</td>
                  <td>{v.players}</td>
                  <td>
                    <button onClick={() => goToRelative(roomURL)}>
                      Entrar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<RoomTable />, document.getElementById("root"));
