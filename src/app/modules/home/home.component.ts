import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  /**
   * Go to page.
   */
  goTo(page: string): void {
    switch (page) {
      case '3D':
        this.router.navigateByUrl('3d');
        break;
      case '2D':
      default:
        this.router.navigateByUrl('2d');
    }
  }
}
