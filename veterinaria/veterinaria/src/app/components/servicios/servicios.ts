import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reveal } from '../../directives/reveal';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  imports: [Reveal],
  selector: 'app-servicios',
  styleUrl: './servicios.css',
  templateUrl: './servicios.html',
})
export class Servicios {
  private readonly serviciosService = inject(ServiciosService);

  protected readonly servicios = toSignal(this.serviciosService.getServicios(), {
    initialValue: [],
  });
}
