import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Match } from '../models/match.model';

const baseUrl = 'http://localhost:8080/api/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  getplayerinfo(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  getplayerstat(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/playerstat/${id}`);
  }
  getplayercareer(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/playercareer/${id}`);
  }
  getplayerbowling(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/playerbowling/${id}`);
  }
  getplayerbowlstat(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/playerbowlstat/${id}`);
  }
}

