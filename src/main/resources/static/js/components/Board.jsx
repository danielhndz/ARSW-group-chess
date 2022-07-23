const React = require("react");
const { Tile } = require("./Tile.jsx");
const {
  whiteTileClassName,
  highlightWhiteClassName,
  highlightBlackClassName,
  highlightBorderClassName,
  parsePiece,
} = require("../utils.js");
const { Chess } = require("chess.js");

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    this.verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    this.state = {
      board: [],
      move: { from: "", to: "" },
      chess: new Chess(this.props.fen),
    };
    console.log("Componente construído");
  }

  highlightLegalMoves(square) {
    let moves = this.state.chess.moves({ square: square, verbose: true });
    let tile = document.getElementsByClassName("square-" + square).item(0);
    if (tile.classList.contains(whiteTileClassName)) {
      tile.classList.add(highlightWhiteClassName);
    } else {
      tile.classList.add(highlightBlackClassName);
    }
    for (const move of moves) {
      tile = document.getElementsByClassName("square-" + move.to).item(0);
      if (tile.classList.contains(whiteTileClassName)) {
        tile.classList.add(highlightWhiteClassName);
      } else {
        tile.classList.add(highlightBlackClassName);
      }
    }
  }

  hideLegalMoves(square) {
    let moves = this.state.chess.moves({ square: square, verbose: true });
    let tile = document.getElementsByClassName("square-" + square).item(0);
    if (tile.classList.contains(highlightWhiteClassName)) {
      tile.classList.remove(highlightWhiteClassName);
    } else {
      tile.classList.remove(highlightBlackClassName);
    }
    for (const move of moves) {
      tile = document.getElementsByClassName("square-" + move.to).item(0);
      if (tile.classList.contains(highlightWhiteClassName)) {
        tile.classList.remove(highlightWhiteClassName);
      } else {
        tile.classList.remove(highlightBlackClassName);
      }
    }
  }

  highlightFromTile(square) {
    let tile;
    if (this.state.move.from === "") {
      tile = document.getElementsByClassName("square-" + square).item(0);
      tile.classList.add(highlightBorderClassName);
      this.setState({ move: { from: square } });
    } else {
      if (this.state.move.from === square) {
        this.removeClassFromSquare(square, highlightBorderClassName);
        this.setState({ move: { from: "" } });
      } else {
        this.removeClassFromSquare(
          this.state.move.from,
          highlightBorderClassName
        );
        tile = document.getElementsByClassName("square-" + square).item(0);
        tile.classList.add(highlightBorderClassName);
        this.setState({ move: { from: square } });
      }
    }
  }

  moveHighlightedTile(square) {
    console.log("moveHighlightedTile");
    if (this.state.move.from !== "") {
      console.log("old board\n", this.state.chess.ascii());
      this.state.chess.move({ from: this.state.move.from, to: square });
      console.log("new board\n", this.state.chess.ascii());
      this.props.webSocketChannel.sendBoard(this.state.chess.fen());
      this.removeClassFromSquare(
        this.state.move.from,
        highlightBorderClassName
      );
    }
  }

  removeClassFromSquare(square, className) {
    let tile = document.getElementsByClassName("square-" + square).item(0);
    if (tile.classList.contains(className)) {
      tile.classList.remove(className);
    }
  }

  componentDidMount() {
    this.props.webSocketChannel.setBoardCallback((board) => {
      console.log("On Board.boardCallback()");
      console.log("Updated board : \n", board);
      this.setState({ chess: new Chess(board) });
      this.updateTiles();
    });
    this.updateTiles();
  }

  updateTiles() {
    console.log("updateTiles");
    let updatedBoard = [],
      i = 0,
      j = 7;
    console.log("chess.board()\n", this.state.chess.ascii());
    for (const row of this.state.chess.board()) {
      console.log("row", row);
      for (const tile of row) {
        console.log("tile", tile);
        updatedBoard.push(
          <Tile
            number={i + j + 2}
            square={this.horizontalAxis[i] + this.verticalAxis[j]}
            imageLink={parsePiece(tile)}
            onMouseEnterCallback={(square) => {
              console.log("onMouseEnterCallback");
              this.highlightLegalMoves(square);
            }}
            onMouseLeaveCallback={(square) => {
              console.log("onMouseLeaveCallback");
              this.hideLegalMoves(square);
            }}
            onClickFromTileCallback={(square) => {
              console.log("onClickFromTileCallback");
              this.highlightFromTile(square);
            }}
            onClickToTileCallback={(square) => {
              console.log("onClickToTileCallback");
              this.moveHighlightedTile(square);
            }}
          />
        );
        i++;
      }
      i = 0;
      j--;
    }
    this.setState({ board: updatedBoard });
  }

  render() {
    console.log("render");
    return (
      <div id="board-container">
        <div id="board">{this.state.board}</div>
      </div>
    );
  }
}
