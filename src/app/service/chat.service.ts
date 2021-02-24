import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";


export interface MessageEventDto {
  socketId: string;
  roomId: string;
  username: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket, private httpClient: HttpClient) {

  }

  connected(): boolean {
    return this.socket.ioSocket.connected;
  }

  getSocketId(): string {
    return this.socket.ioSocket.id;
  }


  sendMessage(message: MessageEventDto): void {
    this.socket.emit('exchanges', message);
  }

  participate(roomId: string, username: string, avatar: string): boolean {
    this.socket.emit('participants', {roomId, username, avatar});
    return this.socket.ioSocket.connected;
  }

  receiveEvent(eventId: string): Observable<any> {
    return this.socket.fromEvent(eventId);
  }

  getMessage(roomId: string, fromIndex: number, toIndex: number): Observable<MessageEventDto[]> {
    return this.httpClient.get<MessageEventDto[]>(
      `/api/v1/rooms/${roomId}/messages?fromIndex=${fromIndex}&toIndex=${toIndex}`,
      { headers: { 'Access-Control-Allow-Origin': '*'}, withCredentials: true}, );
  }

}
