import {WebSocket,
  WebSocketServer
} from 'ws';

import {
  //  app,
  // BrowserWindow,
  // shell,
  ipcMain,
} from 'electron';

// websocket server  (local area network / ethernet-to-ethernet)


export default class MainWebSocket {
  host: string;
  port: number;
  isHost: boolean;
  clientSocket
  serverSocket
  onDataFunction

  constructor(host: string = 'localhost', port: number = 43591, isHost: boolean = false) {
    this.host = host;
    this.port = port;
    this.isHost = isHost;
    this.onDataFunction = null
  }

  onData(execFunc) {
    this.onDataFunction = execFunc
  }

  dataHandler(data) {
    if(this.onDataFunction != null) {
      this.onDataFunction(data, this.isHost)
    }
    else {
      console.log('dataHandler() ERROR - onData not provided')
    }
  }

  initWebsocket() {

    // Client
    if(this.isHost == false) {
      try {
        let myConnectionString = `ws://${this.host}:${this.port}/path`
        console.log(`ws://${this.host}:${this.port}/path`)
        this.clientSocket = new WebSocket(myConnectionString);
 
        this.clientSocket.on('open', () => {
          const array = new Float32Array(5);

          for (var i = 0; i < array.length; ++i) {
            array[i] = i / 2;
          }

          // this.clientSocket.send(array);
          this.clientSocket.send('i lol');
        });

        this.clientSocket.on('message', (data) => {
          console.log('received: %s', data);
        });

        this.clientSocket.on('error', (error) => {
          console.log('WEBSOCKET ERROR received: %s', error);
        });

      } catch (e) {
        console.log('websocke error');
        console.log(e);
      }
    }

    // Server
    else {
      this.serverSocket = new WebSocketServer({ port: this.port });

      this.serverSocket.on('connection', (myConnection) => {
        myConnection.on('message', (data) => {
          console.log('received: %s', data);
          this.dataHandler(data)
        });
 
        myConnection.send('SERVER: CONNECTION_SUCCESSFULLY_OBTAINED');
      });

      this.serverSocket.on('error', (e) =>  {
        console.log('server error:')
        console.log(e)
      }) 
    }
  }

  send(data) {
    if(this.isHost == false) {
      this.clientSocket.send(data);
    }

    else {
      // myConnection.send('something');
      // todo: seems like me may need to set up an collection of connections and id them somehow it we want multiple data
      //   todo: we'll need this so we can send key presses directly to client application (if needed)
      console.log('IS HOST AND TRIED TO SEND: ' + data)
    }
  }
}

