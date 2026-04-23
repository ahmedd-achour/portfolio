import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Home2Component } from './home2/home2.component';
import { Home3Component } from './home3/home3.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home2', component: Home2Component },
    { path: 'home3', component: Home3Component },
];
