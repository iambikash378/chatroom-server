import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;


  onModuleInit(){

    console.log("Websocket gateway initialized");

    this.server.on('connection', (socket) => {
      console.log(socket.id)
      console.log('Connected');
    })
  }

  @SubscribeMessage('newMessage') // Subscribe to message events
  handleMessage(@MessageBody() msg: any): any { 
    console.log(`${msg}`);
    this.server.emit('onMessage', {
      msg: 'New Message', 
      content: msg
    })
  }

} 
 