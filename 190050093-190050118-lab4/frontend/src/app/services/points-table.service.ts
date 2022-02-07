import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/pointsTable';

@Injectable({
  providedIn: 'root'
})
export class PointsTableService {

  constructor(private http: HttpClient) { }
  
  getplayerinfo(year: any): Observable<any> {
    return this.http.get(`${baseUrl}/${year}`);
  }
}
