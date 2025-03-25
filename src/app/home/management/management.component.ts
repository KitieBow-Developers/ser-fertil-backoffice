import { Component } from '@angular/core';
import { ReasonsComponent } from './reasons/reasons.component';
import { AccountsComponent } from './accounts/accounts.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [ReasonsComponent, AccountsComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})

export class ManagementComponent {

}
