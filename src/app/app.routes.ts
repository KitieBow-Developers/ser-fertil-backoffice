import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AgendaComponent } from './home/agenda/agenda.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, children: [
        {path: 'agenda', component: AgendaComponent}
    ]}
];
