import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reveal } from '../../directives/reveal';
import { InicioService } from '../../services/inicio.service';

@Component({
  imports: [Reveal],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  private readonly inicioService = inject(InicioService);

  protected readonly inicio = toSignal(this.inicioService.getInicio(), {
    initialValue: undefined,
  });
}
