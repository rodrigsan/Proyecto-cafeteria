import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../../services/data';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        {
          provide: DataService,
          useValue: {
            getContacto: () =>
              of({
                horarios: {
                  lunesAViernes: '08:30–19:00',
                  sabado: '09:00–14:00',
                  domingo: 'Cerrado',
                },
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
