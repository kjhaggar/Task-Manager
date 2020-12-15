import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const anonymousPages = ['/login'];

    if (anonymousPages.indexOf(state.url) !== -1) {
      if (this.authService.loggedIn()) {
        // Navigate to home page of each platform
        this.router.navigate(['/dashboard']);
        return false;
      }
    } else {
      // if user is not logged in yet
      if (!this.authService.loggedIn()) {
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }
}
