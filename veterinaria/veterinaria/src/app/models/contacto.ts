export interface Contacto {
  direccion: string;
  telefono: string;
  correo: string;
  horarios: {
    lunesAViernes: string;
    sabado: string;
    domingo: string;
  };
  coordenadas: {
    latitud: number;
    longitud: number;
  };
}
