import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  imports: [],
  selector: 'app-chatbot',
  styleUrl: './chatbot.css',
  templateUrl: './chatbot.html',
})
export class Chatbot {
  private readonly chatbotService = inject(ChatbotService);

  protected readonly isOpen = signal(false);
  protected readonly messages = signal<{ role: 'user' | 'bot'; text: string }[]>([]);
  protected inputValue = '';
  protected readonly loading = signal(false);

  protected toggleChat(): void {
    this.isOpen.update((open) => !open);
  }

  protected async enviarMensaje(): Promise<void> {
    const texto = this.inputValue.trim();
    if (!texto || this.loading()) return;

    this.messages.update((msgs) => [...msgs, { role: 'user', text: texto }]);
    this.inputValue = '';
    this.loading.set(true);

    try {
      const respuesta = await firstValueFrom(this.chatbotService.enviarMensaje(texto));
      this.messages.update((msgs) => [
        ...msgs,
        { role: 'bot', text: respuesta?.response ?? 'No obtuve respuesta.' },
      ]);
    } catch {
      this.messages.update((msgs) => [
        ...msgs,
        { role: 'bot', text: 'Lo siento, no pude conectar con el asistente. Inténtalo más tarde.' },
      ]);
    } finally {
      this.loading.set(false);
    }
  }
}
