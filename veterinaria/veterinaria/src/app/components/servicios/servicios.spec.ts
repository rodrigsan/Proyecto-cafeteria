import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Servicios } from './servicios';

describe('Servicios', () => {
  let component: Servicios;
  let fixture: ComponentFixture<Servicios>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Servicios],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Servicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTesting
      .expectOne('/data/servicios.json')
      .flush([
        {
          id: 1,
          nombre: 'Café de especialidad',
          descripcion: 'Evaluación clínica completa.',
          icono: 'stethoscope',
          precio: 80,
        },
      ]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the service data', () => {
    expect(fixture.nativeElement.textContent).toContain('NUESTROS SERVICIOS');
    expect(fixture.nativeElement.textContent).toContain('Café de especialidad');
    expect(fixture.nativeElement.textContent).toContain('Evaluación clínica completa.');
    expect(fixture.nativeElement.textContent).toContain('80');
  });
});
