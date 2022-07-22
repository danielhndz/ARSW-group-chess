const React = require("react");

export class Tile extends React.Component {
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
