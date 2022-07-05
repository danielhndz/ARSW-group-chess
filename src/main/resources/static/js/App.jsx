function getRoomsWSURL() {
  return "ws://" + window.location.host + "/rooms";
}

function goToRelative(url) {
  window.open(url, "_blank");
}

class RoomsWS {
  constructor(url, callback) {
    this.url = url;
    this.wsocket = new WebSocket(url);
    this.wsocket.onopen = (evt) => this.onOpen(evt);
    this.wsocket.onmessage = (evt) => this.onMessage(evt);
    this.wsocket.onerror = (evt) => this.onError(evt);
    this.callback = callback;
  }

  onOpen(evt) {
    console.log("On onOpen", evt);
  }

  onMessage(evt) {
    console.log("On onMesagge", evt);
    if (evt.data != "Connection established.") {
      this.callback(evt.data);
    }
  }

  onError(evt) {
    console.log("On onError", evt);
  }

  sendRoom(room) {
    let roomJSON = JSON.stringify(room);
    console.log("Sending : ", roomJSON);
    this.wsocket.send(roomJSON);
  }
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
    this.webSocketChannel = new RoomsWS(getRoomsWSURL(), (rooms) => {
      let roomsJSON = JSON.parse(rooms);
      console.log("On func call back", roomsJSON);
      this.setState({ rooms: roomsJSON });
    });
  }

  handleChange(evt) {
    console.log("On handleChange - ", evt);
    this.setState({ roomName: evt.target.value });
  }

  handleSubmit(evt) {
    console.log("On handleSubmit - ", evt);
    if (this.state.roomName.trim().length > 0) {
      let room = { name: this.state.roomName };
      this.webSocketChannel.sendRoom(room);
      this.setState({ roomName: "" });
    } else {
      alert("Nombre inválido");
    }
    evt.preventDefault();
  }

  render() {
    console.log("On render");
    return (
      <div>
        <p>Salas activas: {this.state.rooms.length}</p>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.roomName}
              onChange={this.handleChange}
            />
          </label>
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
              let roomURL = "/room/" + v.name;
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
