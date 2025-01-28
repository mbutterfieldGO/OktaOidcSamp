import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-79219993.okta.com/oauth2/default',
  clientId: '0oamew4002f4YwbOt5d7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'offline_access', 'email'],
});


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      importProvidersFrom(OktaAuthModule.forRoot({ oktaAuth })
    )]
};


// work pkce flow

// const oktaAuth = new OktaAuth({
//   issuer: 'https://dev-79219993.okta.com/oauth2/default',
//   clientId: '0oamew4002f4YwbOt5d7',
//   redirectUri: window.location.origin + '/login/callback',
//   scopes: ['openid', 'profile', 'offline_access', 'email'],
// });