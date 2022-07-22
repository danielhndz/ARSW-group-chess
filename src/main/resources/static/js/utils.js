export function getRoomWSURL() {
  return "ws://" + window.location.host + "/" + window.location.pathname;
}

export function getRoomsWSURL() {
  return "ws://" + window.location.host + "/rooms";
}

export function goToRelative(url) {
  window.open(url, "_blank");
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
