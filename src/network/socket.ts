import io, { Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export default class SocketConnector {
  private socket: Socket;

  constructor() {
    this.socket = io(URL);
    this.setup();
  }

  private setup() {
    try {
      this.socket.on("connect", () => {
        console.log("Welcome to the server");
      });
    } catch (e) {
      console.log("Error: ", e);
    }
  }
}
