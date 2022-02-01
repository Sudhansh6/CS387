import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Match } from '../models/match.model';

const baseUrl = 'http://localhost:8080/api/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  getBatsmenInnings1(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/batsmenInnings1/${id}`);
  }
  getTotalInnings1(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/totalInnings1/${id}`);
  }
  getBowlersInnings1(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/bowlersInnings1/${id}`);
  }
  
  getBatsmenInnings2(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/batsmenInnings2/${id}`);
  }
  getTotalInnings2(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/totalInnings2/${id}`);
  }
  getBowlersInnings2(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/bowlersInnings2/${id}`);
  }
}