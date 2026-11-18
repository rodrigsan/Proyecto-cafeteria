import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactoCreate, ContactoMessage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  private readonly api = inject(ApiService);

  enviarMensaje(data: ContactoCreate): Observable<ContactoMessage> {
    return this.api.post<ContactoMessage>('/contactos', data);
  }

  listarMensajes(): Observable<ContactoMessage[]> {
    return this.api.get<ContactoMessage[]>('/contactos');
  }
}
