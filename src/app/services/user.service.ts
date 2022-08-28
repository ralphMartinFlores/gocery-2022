import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  loginState: boolean = false;

  constructor() { }

  isLoggedIn(): boolean {
    let log = window.sessionStorage.getItem('loginState');
    return (log==='true'?true:false);
  }

  setLogin(): void {
    window.sessionStorage.setItem('loginState', 'true');
  }

  setLogout(): void {
    window.sessionStorage.clear();
    this.loginState = false;
  }
}
