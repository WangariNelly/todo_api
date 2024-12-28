// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error.message);
        return throwError(() => new Error('Registration failed.'));
      })
    );
  }
  

  forgotPassword(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/forgot`, email);
  }

  resetPassword(token: string, newPassword: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/reset-password/${token}`, newPassword);
  }
}
