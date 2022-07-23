export function getRoomWSURL() {
  if (window.location.hostname === "localhost") {
    return "ws://" + window.location.host + "/" + window.location.pathname;
  } else {
    return "wss://" + window.location.host + "/" + window.location.pathname;
  }
}

export function getRoomListWSURL() {
  if (window.location.hostname === "localhost") {
    return "ws://" + window.location.host + "/rooms";
  } else {
    return "wss://" + window.location.host + "/rooms";
  }
}

export function goToRelative(url) {
  window.open(url, "_blank");
}

export function parsePiece(tile) {
  let path = "../../image/assets/";
  try {
    switch (tile.type.toLowerCase()) {
      case "r":
        path += "rook";
        break;
      case "n":
        path += "knight";
        break;
      case "b":
        path += "bishop";
        break;
      case "q":
        path += "queen";
        break;
      case "k":
        path += "king";
        break;
      case "p":
        path += "pawn";
        break;
      default:
        return "";
    }
    path += "_" + tile.color + ".png";
  } catch (error) {
    console.log(error);
    return "";
  }
  return path;
}

export class RoomWS {
  constructor(url, roomCallback, readyUsersCallback, sessionIdCallback) {
    this.url = url;
    this.wsocket = new WebSocket(url);
    this.wsocket.onopen = (evt) => this.onOpen(evt);
    this.wsocket.onmessage = (evt) => this.onMessage(evt);
    this.wsocket.onerror = (evt) => this.onError(evt);
    this.roomCallback = roomCallback;
    this.readyUsersCallback = readyUsersCallback;
    this.sessionIdCallback = sessionIdCallback;
    this.boardCallback = (board) => {
      console.log("On boardCallback()");
      console.log("Updated board : \n", board);
    };
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
      } else if (evt.data.startsWith("board ")) {
        console.log("On onMessage - board", evt.data);
        this.boardCallback(evt.data.substring(6));
      }
    }
  }

  onError(evt) {
    console.log("On onError", evt);
  }

  sendUserReady() {
    this.wsocket.send("user ready");
  }

  sendBoard(board) {
    console.log("Sending : ", board);
    this.wsocket.send("board " + board);
  }

  setBoardCallback(callback) {
    this.boardCallback = callback;
  }
}

export class RoomListWS {
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
