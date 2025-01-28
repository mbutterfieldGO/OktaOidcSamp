import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceGatherService {
  private _resourceUrl: string = `https://localhost:7161/api/WeatherForecast`

  constructor(private httpClient: HttpClient) {

  }

  getResource(idToken: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);
    return this.httpClient.get<any>(this._resourceUrl, { headers });
  }
}
