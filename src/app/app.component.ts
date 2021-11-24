import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from './services/http.service';
import { SocketConnectService } from './services/socket-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'twitterfrontend';
  page: number = 1;
  counter: number = 0;
  subscription: Subscription[] = []
  constructor(public socketConnect: SocketConnectService, public http: HttpService) {

  }
  connectionStatus: any
  ngOnInit() {
    // tweet
    this.socketConnect.connectionStatus().subscribe(
      (data) => {
        console.log("Connection Status    ************** ", data);
        this.connectionStatus = data.status;
      }
    );
    this.socketConnect.getTweet().subscribe(
      (data) => {
        console.log("tweet    ************** ", data);
        // this.connectionStatus = data.status;
        this.counter=this.counter+1;
      }
    );
    this.getTweets();
  }
  tweetList: any = [];
  getTweets() {
    let getData = {
      url: 'twitter/get-tweets',
      queryParams: { page: this.page, limit: 25 },
    };
    this.subscription.push(
      this.http
        .getFunction(getData)
        .subscribe(
          (response: any) => {
            console.log(response, "response");
            if (response['status'] == 200) {
              this.tweetList =[...this.tweetList,...response.data.results]
              console.log(response, "statusstatusstatusstatus", this.tweetList);
            } else {

            }
            this.loadMorePressed=false
          },
          (err) => {
          }
        )
    )
  }
  loadMorePressed:boolean=false
  loadMore(){
    this.loadMorePressed=true;
    this.page=this.page+1;
    this.getTweets();
  }
  searchKeywordPressed:boolean=false
  searchString:string='';
  searchKeyword(){
    if(!this.searchString) return; 
    this.searchKeywordPressed=true;
    let postData = {
      url: 'twitter/set-rules',
      data:{
        "rules":[{ "value": this.searchString }]
      }
    };
    this.subscription.push(
      this.http
        .postFunction(postData)
        .subscribe(
          (response: any) => {
            console.log(response, "response");
            if (response['status'] == 200) {
              // this.tweetList = response.data.results
              // console.log(response, "statusstatusstatusstatus", this.tweetList);
            } else {

            }
            this.searchKeywordPressed=false
          },
          (err) => {
          }
        )
    )
  }
}
