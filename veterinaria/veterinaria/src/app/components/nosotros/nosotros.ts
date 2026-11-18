import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reveal } from '../../directives/reveal';
import { NosotrosService } from '../../services/nosotros.service';
import { Nosotros as NosotrosModel } from '../../models';

@Component({
  imports: [Reveal],
  selector: 'app-nosotros',
  styleUrl: './nosotros.css',
  templateUrl: './nosotros.html',
})
export class Nosotros {
  private readonly nosotrosService = inject(NosotrosService);

  protected readonly nosotrosRaw = toSignal(this.nosotrosService.getNosotros(), {
    initialValue: undefined,
  });

  protected readonly nosotros = computed<NosotrosModel | undefined>(() => {
    const datos = this.nosotrosRaw();
    if (!datos) return undefined;
    let horarios = datos.horarios;
    if (typeof horarios === 'string') {
      horarios = JSON.parse(horarios);
    }
    return { ...datos, horarios };
  });

  protected readonly galeria = toSignal(
    this.nosotrosService.getGaleriaFotos(1),
    { initialValue: [] }
  );
}
