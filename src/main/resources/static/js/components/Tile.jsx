const React = require("react");

export class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
    this.handleOnClickFromTile = this.handleOnClickFromTile.bind(this);
    this.handleOnClickToTile = this.handleOnClickToTile.bind(this);
  }

  handleOnMouseEnter() {
    console.log("handleOnMouseEnter");
    this.props.onMouseEnterCallback(this.props.square);
  }

  handleOnMouseLeave() {
    console.log("handleOnMouseLeave");
    this.props.onMouseLeaveCallback(this.props.square);
  }

  handleOnClickFromTile() {
    console.log("handleOnClickFromTile");
    this.props.onClickFromTileCallback(this.props.square);
  }

  handleOnClickToTile() {
    console.log("handleOnClickToTile");
    this.props.onClickToTileCallback(this.props.square);
  }

  render() {
    let className;
    if (this.props.number % 2 === 0) {
      className = "tile black-tile square-" + this.props.square;
      if (this.props.imageLink !== "") {
        return (
          <div
            draggable
            className={className}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
            onClick={this.handleOnClickFromTile}
          >
            <img src={this.props.imageLink} />
          </div>
        );
      } else {
        return (
          <div
            className={className}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
            onClick={this.handleOnClickToTile}
          ></div>
        );
      }
    } else {
      className = "tile white-tile square-" + this.props.square;
      if (this.props.imageLink !== "") {
        return (
          <div
            draggable
            className={className}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
            onClick={this.handleOnClickFromTile}
          >
            <img src={this.props.imageLink} />
          </div>
        );
      } else {
        return (
          <div
            className={className}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
            onClick={this.handleOnClickToTile}
          ></div>
        );
      }
    }
  }
}
