// src/app/core/services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${endpoint}`, { params });
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${endpoint}/${id}`);
  }
}
