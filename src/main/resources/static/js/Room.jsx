class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.number % 2 === 0) {
      return <div className="tile black-tile">{this.props.msg}</div>;
    } else {
      return <div className="tile white-tile">{this.props.msg}</div>;
    }
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    let firstBoard = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
      for (let i = 0; i < horizontalAxis.length; i++) {
        firstBoard.push(
          <Tile number={i + j + 2} msg={horizontalAxis[i] + verticalAxis[j]} />
        );
      }
    }
    this.state = { board: firstBoard };
    console.log("Tablero construído");
  }

  componentDidMount() {
    console.log("Tablero montado");
  }

  render() {
    return (
      <div id="board-container">
        <div id="board">{this.state.board}</div>
      </div>
    );
  }
}

function getRoomWSURL() {
  return "ws://" + window.location.host + "/" + window.location.pathname;
}

class RoomWS {
  constructor(url, roomCallback, readyUsersCallback, sessionIdCallback) {
    this.url = url;
    this.wsocket = new WebSocket(url);
    this.wsocket.onopen = (evt) => this.onOpen(evt);
    this.wsocket.onmessage = (evt) => this.onMessage(evt);
    this.wsocket.onerror = (evt) => this.onError(evt);
    this.roomCallback = roomCallback;
    this.readyUsersCallback = readyUsersCallback;
    this.sessionIdCallback = sessionIdCallback;
  }

  onOpen(evt) {
    console.log("On onOpen", evt);
  }

  onMessage(evt) {
    console.log("On onMessage - message = ", evt.data);
    if (evt.data != "Connection established.") {
      if (evt.data.startsWith("room ")) {
        console.log("On onMessage - room", evt.data);
        this.roomCallback(evt.data.substring(5));
      } else if (evt.data.startsWith("ready users ")) {
        console.log("On onMessage - ready users", evt.data);
        this.readyUsersCallback(evt.data.substring(12));
      } else if (evt.data.startsWith("session id ")) {
        console.log("On onMessage - session id", evt.data);
        this.sessionIdCallback(evt.data.substring(11));
      }
    }
  }

  onError(evt) {
    console.log("On onError", evt);
  }

  sendUserReady() {
    this.wsocket.send("user ready");
  }
}

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      room: { players: 0 },
      readyUsers: {},
      sessionId: 0,
    };
  }

  componentDidMount() {
    this.webSocketChannel = new RoomWS(
      getRoomWSURL(),
      (room) => {
        let roomJSON = JSON.parse(room);
        console.log("On room func call back", roomJSON);
        this.setState({ room: roomJSON });
      },
      (readyUsers) => {
        let readyUsersJSON = JSON.parse(readyUsers);
        console.log("On ready users func call back", readyUsersJSON);
        this.setState({ readyUsers: readyUsersJSON });
        let currentReady = this.state.room.players > 1;
        Object.entries(this.state.readyUsers).map((v) => {
          console.log("v[0] = user." + v[0] + "\nv[1] = " + v[1]);
          currentReady = currentReady && v[1];
          console.log("currentReady = ", currentReady);
          this.setState({ ready: currentReady });
        });
      },
      (currentSessionId) => {
        console.log("On session id func call back", currentSessionId);
        this.setState({ sessionId: currentSessionId });
      }
    );
  }

  render() {
    if (!this.state.ready) {
      return (
        <div>
          <h3>Esperando jugadores ...</h3>
          <p>Jugadores conectados: {this.state.room.players}</p>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.readyUsers).map((v) => {
                if (v[0] === this.state.sessionId) {
                  if (v[1]) {
                    return (
                      <tr key={v[0]}>
                        <td>user.{v[0]} (you)</td>
                        <td>Listo!</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={v[0]}>
                        <td>user.{v[0]} (you)</td>
                        <td>
                          <button
                            onClick={() => {
                              console.log("click");
                              this.webSocketChannel.sendUserReady();
                            }}
                          >
                            Listo!
                          </button>
                        </td>
                      </tr>
                    );
                  }
                } else if (v[1]) {
                  return (
                    <tr key={v[0]}>
                      <td>user.{v[0]}</td>
                      <td>Listo!</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={v[0]}>
                      <td>user.{v[0]}</td>
                      <td>Preparándose</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <Board />;
    }
  }
}

ReactDOM.render(<Room />, document.getElementById("root"));
