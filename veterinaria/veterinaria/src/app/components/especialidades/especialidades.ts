import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reveal } from '../../directives/reveal';
import { EspecialidadesService } from '../../services/especialidades.service';

@Component({
  imports: [Reveal],
  selector: 'app-especialidades',
  styleUrl: './especialidades.css',
  templateUrl: './especialidades.html',
})
export class Especialidades {
  private readonly especialidadesService = inject(EspecialidadesService);

  protected readonly especialidades = toSignal(
    this.especialidadesService.getEspecialidades(),
    { initialValue: [] }
  );

  protected readonly destacados = toSignal(
    this.especialidadesService.getEspecialidades(),
    { initialValue: [] }
  );
}
