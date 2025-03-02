import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

let io = null as Server | null;

const webSocketService = {
  initialize: (server: HTTPServer): void => {
    io = new Server(server, {
      cors: {
        origin: "*",
      }
    });

    io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("message", (data: WebSocketMessage) => {
        webSocketService.handleMessage(socket, data);
      });

      socket.on('emitToRoom', (data: WebSocketMessage) => {
        const { roomId, message } = data;
        console.log(`Emitting message to room: ${roomId} 👀`);
        webSocketService.emitToRoom('message', roomId, message);
      });

      socket.on("customEvent", (data: any) => {
        socket.emit("ack", { message: "Event received!" });
      });

      socket.on("heartbeat", () => {
        socket.emit("heartbeat_ack");
        console.log(`Heartbeat received from client: ${socket.id} 🤟🏼`);
      });

      socket.on("disconnect", (reason: string) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
      });
    });
  },

  handleMessage(socket: Socket, data: WebSocketMessage): void {
    switch (data.type) {
      case "order_assigned":
        console.log("Order assigned message received");
        break;
      case 'joinRoom':
        console.log(`${socket.id} joining room: ${data.roomId}`);
        socket.join(String(data.roomId));
        break;
      default:
        console.log(`Unhandled message type: ${data.type}`);
    }
  },

  emitToRoom(key: string, roomId: string, message: WebSocketMessage): void {
    console.log(`Emitting message to room: ${roomId} 💪🏼`);
    io?.to(String(roomId)).emit(key, message);
  },

  sendToClient(clientId: string, message: WebSocketMessage): void {
    const socket = io?.sockets.sockets.get(clientId);
    if (socket) {
      socket.emit("message", message);
    }
  },

  broadcast(key: string, message: WebSocketMessage, excludeClientId: string | null = null): void {
    io?.sockets.sockets.forEach((socket: Socket) => {
      if (socket.id !== excludeClientId) {
        socket.emit(key, message);
      }
    });
  }
};

export default webSocketService;
