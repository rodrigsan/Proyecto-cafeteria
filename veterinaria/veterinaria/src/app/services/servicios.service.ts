import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Servicio } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private readonly api = inject(ApiService);

  getServicios(): Observable<Servicio[]> {
    return this.api.get<Servicio[]>('/servicios');
  }
}
