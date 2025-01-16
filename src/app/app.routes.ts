import { Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'login/callback', component: OktaCallbackComponent },
    { path: 'profile', component: ProfileComponent }
];
