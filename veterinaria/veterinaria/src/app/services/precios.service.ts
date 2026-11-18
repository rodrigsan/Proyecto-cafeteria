import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Precio } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PreciosService {
  private readonly api = inject(ApiService);

  getPrecios(): Observable<Precio[]> {
    return this.api.get<Precio[]>('/precios');
  }
}
