// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, email);
  }

  resetPassword(token: string, newPassword: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, newPassword);
  }
}
