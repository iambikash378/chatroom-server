import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

interface Message{
  text?: string;
  user?: User;
}

interface User{
  id?: string;
  username: string;
  room:string;
}

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  onModuleInit(){
    console.log("Websocket gateway initialized");
    }

    @SubscribeMessage('join')
    handleJoin(@MessageBody() msg: Message , @ConnectedSocket() socket: Socket){
      socket.join(msg.user?.room ?? 'default');
      this.server.to(msg.user?.room || "default").emit('joinedTheChat', `${msg.user?.username || "default"} joined the chatroom ${msg.user?.room || "default"}`)
    }

    @SubscribeMessage('newMessage') // Subscribe to message events
    handleMessage(@MessageBody() msg: Message): any { 
      this.server.to(msg.user?.room ?? 'default').emit('onMessage', {
        msg: msg.text,
        user: msg.user?.username || "anon"
      })
    }

    @SubscribeMessage('leave') // Subscribe to message events
    handleLeave(@MessageBody() msg: Message, @ConnectedSocket() socket : Socket): any { 
      this.server.to(msg.user?.room ?? 'default').emit('leftRoom', 
        `${msg.user?.username || "anon"} left the room`
      )
      socket.disconnect(true);
    }
  }
 