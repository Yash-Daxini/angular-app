import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'
  constructor(private http: HttpClient) { }

  get<T>(): Observable<HttpEvent<T>> {
    return this.http.get<T>(`${this.apiUrl}/order-receipt-template`, {
      responseType: 'json',
      reportProgress: true,
      observe: 'events'
    });
  }
}
