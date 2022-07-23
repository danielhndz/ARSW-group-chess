const React = require("react");
const { Board } = require("./Board.jsx");
const { RoomWS, getRoomWSURL } = require("../utils");
const { Chess } = require("chess.js");

export class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      room: { name: "", players: 0, fen: "" },
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
        console.log(new Chess(this.state.room.fen).ascii());
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
    console.log("render");
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
      console.log(this.state.room.fen);
      return (
        <Board
          board={this.state.room.fen}
          webSocketChannel={this.webSocketChannel}
        />
      );
    }
  }
}
