import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import { catchError, filter, map, Observable } from 'rxjs';
import { ResourceGatherService } from './resource-gather.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthenticated: boolean = false;
  resource$: Observable<string> = new Observable<string>();
  private oktaStateService = inject(OktaAuthStateService);
  private oktaAuth = inject(OKTA_AUTH);
  returnedData: string = '';

  constructor(private ResourceGatherService: ResourceGatherService) {
  
  }

  title = 'okta-angular-quickstart';
  public isAuthenticated$ = this.oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => (s.isAuthenticated && this.hasTokenExpired() === false) ?? false)
  );

  public name$ = this.oktaStateService.authState$.pipe(
    filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
    map((authState: AuthState) => authState.idToken?.claims.name ?? '')
  );

  public async signIn() : Promise<void> {
    await this.oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }

  public async CallProtectedResource() {
    let idToken = this.getIdToken();
    if (idToken === '') {
      this.returnedData = "You are not authorized to view this resource. Have you logged in?";
    }
    else {
      const data = await this.ResourceGatherService.getResource(idToken).subscribe(data => { 
        this.returnedData = data.message;
      })
    };
  }

  getIdToken(): string {
    const apiToken = localStorage.getItem('okta-token-storage');
    const parsedToken = apiToken ? JSON.parse(apiToken) : null;
    const idToken = parsedToken ? parsedToken.idToken : null;
    if (idToken === undefined) {
      return '';  // strings cannot be undefined
    }
    return idToken.idToken;
  }

  public hasToken(): boolean {  
    const apiToken = localStorage.getItem('okta-token-storage');
    return !!apiToken;
  }
  
  public hasTokenExpired(): boolean {
    const apiToken = localStorage.getItem('okta-token-storage');
    if (apiToken) {
      const parsedToken = JSON.parse(apiToken);
      const idToken = parsedToken.idToken;
      if (idToken === undefined) {
        return false;  // its possible that there is just a okta-token-storage key that is just empty
      }
      return this.decodeUnixTimestamp(idToken.claims.exp) < new Date();
    }
    return true;
  }

  decodeUnixTimestamp(unixTimestamp: number): Date {
    return new Date(unixTimestamp * 1000);
  }
}
