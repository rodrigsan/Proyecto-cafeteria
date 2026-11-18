import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Especialidad } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private readonly api = inject(ApiService);

  getEspecialidades(): Observable<Especialidad[]> {
    return this.api.get<Especialidad[]>('/especialidades');
  }
}
