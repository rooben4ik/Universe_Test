import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'auth_token';

  constructor() { }
  
  setToken(token: string): void {
    if(localStorage){
      localStorage?.setItem(this.tokenKey, token);

    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  clearToken(): void {
    if(localStorage){
      localStorage?.removeItem(this.tokenKey);
    }
  }
}
