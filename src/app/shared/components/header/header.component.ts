import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  randomNumber = 0;

  private router = inject(Router);

  home() {
    this.router.navigateByUrl('/');
  }

  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * 151) + 1;
    this.router.navigateByUrl(`/pokemon/${this.randomNumber}`);
  }
}
