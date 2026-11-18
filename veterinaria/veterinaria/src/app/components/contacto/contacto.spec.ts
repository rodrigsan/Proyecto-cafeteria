import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../../services/data';
import { Contacto } from './contacto';

describe('Contacto', () => {
  let component: Contacto;
  let fixture: ComponentFixture<Contacto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contacto],
      providers: [
        {
          provide: DataService,
          useValue: {
            getContacto: () =>
              of({
                direccion: 'Av. América esquina Potosí, Cochabamba',
                telefono: '+591 4 445 6789',
                correo: 'hola@coffeehouse.bo',
                horarios: {
                  lunesAViernes: '08:30–19:00',
                  sabado: '09:00–14:00',
                  domingo: 'Cerrado',
                },
                coordenadas: { latitud: -17.3727, longitud: -66.157 },
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Contacto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit while the form is invalid', () => {
    fixture.detectChanges();

    const submit = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
  });

  it('should reject a short message and accept a valid submission', () => {
    component['contactoForm'].setValue({
      nombre: 'Ana',
      correo: 'ana@example.com',
      asunto: 'Consulta',
      mensaje: 'Hola',
    });
    fixture.detectChanges();
    expect(component['contactoForm'].invalid).toBe(true);

    component['contactoForm'].controls.mensaje.setValue('Necesito una consulta');
    fixture.detectChanges();

    const submit = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);

    submit.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      '¡Gracias por escribirnos! Recibimos tu mensaje.',
    );
  });
});
