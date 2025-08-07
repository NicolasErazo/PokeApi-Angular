import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  randomNumber: number = 0;

  constructor(private router: Router) {

  }

  home() {
    this.router.navigateByUrl('/');
  }

  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * 151) + 1;
    this.router.navigateByUrl(`/pokemon/${this.randomNumber}`);
  }
}
