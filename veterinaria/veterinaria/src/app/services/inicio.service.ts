import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Inicio } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InicioService {
  private readonly api = inject(ApiService);

  getInicio(): Observable<Inicio> {
    return this.api.get<Inicio>('/inicio');
  }
}
