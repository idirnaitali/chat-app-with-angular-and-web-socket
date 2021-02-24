import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}};

// const config: SocketIoConfig = { url: 'http://35.192.172.132:3000', options: {}};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


