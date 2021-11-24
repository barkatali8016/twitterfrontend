import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token:any
  environment:any
  constructor(private http: HttpClient) {
    this.environment=environment.apiUrl;
  }

  getHeaders(data:any={}) {
    this.token = localStorage.getItem('accessToken');
    if (!this.token) {
      this.token = '';
    }
    this.token = this.token.replace(/["']/g, '');
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    if(localStorage.getItem('deviceid')){
      let deviceId:any=localStorage.getItem('deviceid');
      headers = headers.append('deviceid',deviceId);
    }
    if(localStorage.getItem('fcmToken')){
      let devicetoken:any=localStorage.getItem('deviceid');
      headers = headers.append('devicetoken',devicetoken);
    }
    // headers = headers.append('xxx', localStorage.getItem('xxxx'));

    let requestHeader: any = {};
    if(data &&  data.hasOwnProperty('queryParams')){
      requestHeader.params = data.queryParams;
    }
    requestHeader.headers = headers;
    console.log(requestHeader,"requestHeader requestHeader")
    return requestHeader;
  }
  getFunction(data:any) {
    return this.http.get(environment.apiUrl + data.url, this.getHeaders(data)).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  putFunction(data: any): Observable<any> {
    return this.http
      .put(environment.apiUrl + data.url, data['data'], this.getHeaders())
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  postFunction(data: any): Observable<any> {
    return this.http
      .post(environment.apiUrl + data.url, data['data'], this.getHeaders())
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  deleteFunction(data: any): Observable<any> {
    return this.http
      .delete(environment.apiUrl + data.url, this.getHeaders())
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  completeApiCall(data: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', 'https://www.google.com/');
    headers.append('Access-Control-Allow-Credentials', 'true');
    let requestHeader: any = {};
    requestHeader.headers = headers;
    return this.http
      .post(data.url, data['data'],requestHeader)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
  handleError(err: Response | any) {
    return throwError(err);
  }
}
