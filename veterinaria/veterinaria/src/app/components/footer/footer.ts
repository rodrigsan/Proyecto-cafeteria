import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NosotrosService } from '../../services/nosotros.service';
import { Nosotros as NosotrosModel } from '../../models';

@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
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

  protected readonly currentYear = new Date().getFullYear();
}
