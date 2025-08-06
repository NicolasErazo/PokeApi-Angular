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
    // Genera un número aleatorio entre 0 y 891 (número máximo de Pokémons de la PokeAPI)
    this.randomNumber = Math.floor(Math.random() * 892); // 0 - 891

    console.log(this.randomNumber);

    // Navega a la ruta correcta
    this.router.navigate(['/pokemon', this.randomNumber]);
  }
}
