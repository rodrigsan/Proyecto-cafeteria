import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reveal } from '../../directives/reveal';
import { NosotrosService } from '../../services/nosotros.service';
import { ContactosService } from '../../services/contactos.service';
import { Nosotros as NosotrosModel } from '../../models';

@Component({
  imports: [ReactiveFormsModule, Reveal],
  selector: 'app-contacto',
  styleUrl: './contacto.css',
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly formBuilder = inject(FormBuilder);
  private readonly nosotrosService = inject(NosotrosService);
  private readonly contactosService = inject(ContactosService);

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

  protected readonly enviado = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);

  protected readonly contactoForm = this.formBuilder.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected enviar(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.cargando.set(true);

    const data = {
      nombre: this.contactoForm.get('nombre')!.value,
      correo: this.contactoForm.get('correo')!.value,
      telefono: this.contactoForm.get('telefono')!.value || null,
      mensaje: this.contactoForm.get('mensaje')!.value,
    };

    this.contactosService.enviarMensaje(data).subscribe({
      next: () => {
        this.cargando.set(false);
        this.enviado.set(true);
        this.contactoForm.reset();
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo enviar el mensaje. Inténtalo de nuevo.');
      },
    });
  }
}
