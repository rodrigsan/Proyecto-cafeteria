import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ChatbotRequest, ChatbotResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly api = inject(ApiService);

  enviarMensaje(prompt: string): Observable<ChatbotResponse> {
    return this.api.post<ChatbotResponse>('/chatbot', { prompt });
  }
}
