import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reveal } from '../../directives/reveal';
import { PreciosService } from '../../services/precios.service';
import { Precio } from '../../models';

@Component({
  imports: [ReactiveFormsModule, Reveal],
  selector: 'app-precios',
  styleUrl: './precios.css',
  templateUrl: './precios.html',
})
export class Precios {
  private readonly preciosService = inject(PreciosService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly precios = toSignal(this.preciosService.getPrecios(), {
    initialValue: [],
  });

  protected readonly preciosPorCategoria = signal<Map<string, Precio[]>>(new Map());

  constructor() {
    this.preciosService.getPrecios().subscribe({
      next: (lista) => {
        const mapa = new Map<string, Precio[]>();
        for (const p of lista) {
          const producto: Precio = {
            ...p,
            precio: Number(p.precio),
          };
          const grupo = mapa.get(p.categoria) ?? [];
          grupo.push(producto);
          mapa.set(p.categoria, grupo);
        }
        this.preciosPorCategoria.set(mapa);
        this.categorias.set(Array.from(mapa.keys()));
      },
    });
  }

  protected readonly categorias = signal<string[]>([]);
}
