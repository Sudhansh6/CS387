import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/venues';
const baseUrl1 = 'http://localhost:8080/api/venues/add';
const baseUrl2 = 'http://localhost:8080/api/venue';
@Injectable({
  providedIn: 'root'
})

export class VenueDetailsService {

  constructor(private http: HttpClient) { }
  getAllvenue(): Observable<any> {
    return this.http.get(baseUrl);
  }
  getvenueinfo(id: any): Observable<any> {
    return this.http.get(`${baseUrl2}/${id}`);
  }
  create(data: any): Observable<any> {
    console.log("request sent to", baseUrl1, data);
    return this.http.post(baseUrl1, data);
  }
  gettempvenueinfo(id: any): Observable<any> {
    return this.http.get(`${baseUrl2}/temp/${id}`);
  }
}
