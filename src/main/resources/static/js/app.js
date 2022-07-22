const ReactDOM = require("react-dom");
const React = require("react");
const { App } = require("./components/App.jsx");
const { Room } = require("./components/Room.jsx");

if (window.location.pathname === "/") {
  ReactDOM.render(<App />, document.getElementById("root"));
} else if (window.location.pathname.startsWith("/room/")) {
  ReactDOM.render(<Room />, document.getElementById("root"));
}
