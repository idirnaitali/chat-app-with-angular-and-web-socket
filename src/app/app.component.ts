import {Component, OnInit} from '@angular/core';
import {ChatService, MessageEventDto} from './service/chat.service';
import {ActivatedRoute, Router} from '@angular/router';

interface Participant {
  avatar: string;
  connected: string;
}

interface ParticipantEvent extends Participant{
  username: string;
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat-app-with-angular';

  public connected = false;
  public roomId = '';
  public username = '';
  private avatar = '';
  public messages: MessageEventDto[] = [];
  public userAvatarsMap = new Map<string, Participant>();
  public messageContent = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const roomId = params.room;
      const username = params.user;
      const avatar = params.avatar;
      if (roomId && username && avatar) {
        this.roomId = roomId;
        this.username = username;
        this.avatar = avatar;
        this.connection();
      }
    });
  }

  private connection() {
    console.log('Connecting user: %s to room: %s', this.username, this.roomId);
    this.chatService.getMessage(this.roomId, 1, 20)
      .subscribe(messages => {
          this.initConnection(messages);
        },
        error => {
          console.error(error);
          alert('Connection failed...');
        });
  }

  private initConnection(messages: MessageEventDto[]) {
    this.messages = messages
    this.chatService.participate(this.roomId, this.username, this.avatar);
    this.chatService.receiveEvent(this.roomId).subscribe((message: MessageEventDto) => {
      console.debug('received message event: ', message);
      this.messages.push(message)
    });
    this.chatService.receiveEvent(`participants/${this.roomId}`).subscribe((participants: ParticipantEvent[]) => {
      console.debug('received participants event: ', participants);
      this.userAvatarsMap = this.toUserAvatarsMap(participants);
    });
    this.connected = true;
  }

  private toUserAvatarsMap(participants: ParticipantEvent[]): Map<string, Participant> {
    const mp = new Map<string, Participant>();
    participants.forEach(p => mp.set(p.username, {avatar: p.avatar, connected: p.connected}));
    return mp;
  }

  sendMessage(): void {
    if (this.messageContent.trim().length === 0) {
      return;
    }
    const message = {
      roomId: this.roomId,
      username: this.username,
      content: this.messageContent,
      createdAt: new Date()
    } as MessageEventDto;

    console.log('Posting message event: ', message);
    this.chatService.sendMessage(message);
    this.messageContent = '';
  }

  navigateToRoom(): void {
    if (this.roomId && this.username && this.avatar) {
      this.connection();
    } else {
      alert('All fields are required.');
    }
  }
}
