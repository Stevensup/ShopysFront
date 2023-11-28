import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Guard that determines if a route can be activated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   * Determines if a route can be activated.
   * @param route - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns An observable of a boolean or UrlTree, a promise of a boolean or UrlTree, or a boolean or UrlTree.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
