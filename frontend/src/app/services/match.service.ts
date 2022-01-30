import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';

const baseUrl = 'http://localhost:8080/api/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(baseUrl);
  }

  // get(id: any): Observable<Tutorial> {
  //   return this.http.get(`${baseUrl}/${id}`);
  // }

  // create(data: any): Observable<any> {
  //   return this.http.post(baseUrl, data);
  // }

  // update(id: any, data: any): Observable<any> {
  //   return this.http.put(`${baseUrl}/${id}`, data);
  // }

  // delete(id: any): Observable<any> {
  //   return this.http.delete(`${baseUrl}/${id}`);
  // }

  // deleteAll(): Observable<any> {
  //   return this.http.delete(baseUrl);
  // }

  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  // }
}