import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Nosotros, GaleriaFoto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NosotrosService {
  private readonly api = inject(ApiService);

  getNosotros(): Observable<Nosotros> {
    return this.api.get<Nosotros>('/nosotros');
  }

  getGaleriaFotos(nosotrosId: number): Observable<GaleriaFoto[]> {
    return this.api.get<GaleriaFoto[]>(`/galeria-fotos/${nosotrosId}`);
  }
}
