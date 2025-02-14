import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApiAuth = 'http://localhost:9999/api/authentication/token';
  private autoLogoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(this.urlApiAuth, credentials).pipe(
      tap((response: any) => {
        console.log('token : ', response.token);
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  autoLogout() {
    const token = localStorage.getItem('authToken');
    console.log('autologut token :', token);
    if (token) {
      const timeLeft = this.getTokenDateExpiration(token);
      console.log('timeLeft in autoLogout : ', timeLeft);
      if (timeLeft) {
        this.autoLogoutTimer = setTimeout(() => {
          this.logout();
        }, timeLeft);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  clearTimeOut() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  getTokenDateExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('****payload : ', payload);
      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        const now = new Date().getTime(); // Temps actuel en ms
        const timeLeft = expirationDate.getTime() - now; // Temps restant en ms

        console.log('***exp : ', payload.exp);
        console.log('date exp : ', expirationDate);
        console.log('Temps restant avant expiration :', timeLeft, 'ms');

        return timeLeft;
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'extraction de la date d'expiration du token :",
        error
      );
      return null;
    }
    return null;
  }
}
