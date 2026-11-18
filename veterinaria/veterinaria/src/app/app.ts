import { Component, signal } from '@angular/core';
import { Chatbot } from './components/chatbot/chatbot';
import { Contacto } from './components/contacto/contacto';
import { Especialidades } from './components/especialidades/especialidades';
import { Footer } from './components/footer/footer';
import { Hero } from './components/hero/hero';
import { Navbar } from './components/navbar/navbar';
import { Nosotros } from './components/nosotros/nosotros';
import { Precios } from './components/precios/precios';
import { Servicios } from './components/servicios/servicios';


@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, Servicios, Especialidades, Nosotros, Precios, Contacto, Footer, Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CoffeeHouse');
}
