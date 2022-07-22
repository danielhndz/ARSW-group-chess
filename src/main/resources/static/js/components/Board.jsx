const React = require("react");
const { Tile } = require("./Tile.jsx");

export class Board extends React.Component {
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
