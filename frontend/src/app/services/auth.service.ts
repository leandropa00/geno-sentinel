import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'geno_sentinel_token';
  private readonly usernameKey = 'geno_sentinel_username';

  // Signals for reactive state management
  authState = signal<AuthState>({
    isAuthenticated: false,
    token: null,
    username: null
  });

  constructor(private http: HttpClient) {
    // Initialize auth state from localStorage
    const token = localStorage.getItem(this.tokenKey);
    const username = localStorage.getItem(this.usernameKey);
    if (token) {
      this.authState.set({
        isAuthenticated: true,
        token,
        username
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, credentials.username);
        this.authState.set({
          isAuthenticated: true,
          token: response.token,
          username: credentials.username
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.authState.set({
      isAuthenticated: false,
      token: null,
      username: null
    });
  }

  getToken(): string | null {
    return this.authState().token || localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  getUsername(): string | null {
    return this.authState().username || localStorage.getItem(this.usernameKey);
  }
}

