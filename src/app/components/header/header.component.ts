import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  randomNumber: number = 0;

  constructor(private router: Router){

  }

  home(){
    this.router.navigateByUrl('/home');
  }

  generateRandomNumber() {
    // Genera un número aleatorio entre 0 y 100
    this.randomNumber = Math.round(Math.random() * 891);

    // Asigna el número aleatorio al input
    console.log(this.randomNumber);

    this.router.navigateByUrl('pokeDetail/'+this.randomNumber)
    
  }

}
