import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/venues';
const baseUrl1 = 'http://localhost:8080/api/venues/add';
@Injectable({
  providedIn: 'root'
})

export class VenueDetailsService {

  constructor(private http: HttpClient) { }
  getAllvenue(): Observable<any> {
    return this.http.get(baseUrl);
  }
  getvenueinfo(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl1, data);
  }
}
