import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  name: string = "Dr. Óscar Manual Hernandez Cicadios";
  cerrarMenu!: boolean;
  isMenuOpen: boolean = false;

  constructor(public route: ActivatedRoute, private router: Router) {

   if(!sessionStorage.getItem('user')){
      this.router.navigate(['']);
    }

  }

  changeSelection(selection: string) {
    switch (selection) {
        case 'agenda': {
          this.router.navigate(['home/agenda']);
          break;
      }
      case 'management': {
        this.router.navigate(['home/management']);
        break;
    }
    }
  }


  ngOnInit(): void {

  }

  openMenu() {
    console.log("d")
    this.isMenuOpen = true;
  }

  closeMenu() {
    console.log("f")
    this.isMenuOpen = false;
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
    window.location.reload();
  }
}
