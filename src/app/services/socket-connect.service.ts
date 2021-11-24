import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectService {


  private socket: Socket;
  private url = environment.uploadsUrl; // your server local path

  constructor() {
    this.socket = io(this.url,
      {
        transports: ['websocket', 'polling', 'flashsocket'],
        auth: {
          token : `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
  }

  connectionStatus(): Observable<any> {
    return new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('connection-response', (data) => {
        console.log('connection-response ',data);

        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  getTweet(): Observable<any> {
    return new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('tweet', (data) => {
        console.log('tweet',data);
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }
}

