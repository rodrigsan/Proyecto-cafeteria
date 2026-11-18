export interface Inicio {
  id: number;
  titulo_principal: string;
  subtitulo: string;
  texto_boton: string;
  url_video_pexels: string;
  activo: number;
  created_at: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  imagen: string;
  activo: number;
  created_at: string;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  destacado: number;
  activo: number;
  created_at: string;
}

export interface Nosotros {
  id: number;
  historia: string;
  direccion: string;
  telefono: string;
  correo: string | null;
  horarios: {
    lunesAViernes: string;
    sabado: string;
    domingo: string;
  };
  creado_en: string;
}

export interface GaleriaFoto {
  id: number;
  nosotros_id: number;
  imagen: string;
  descripcion: string | null;
  orden: number;
}

export interface Precio {
  id: number;
  categoria: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: number;
  created_at: string;
}

export interface ContactoMessage {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  mensaje: string;
  fecha: string;
}

export interface ContactoCreate {
  nombre: string;
  correo: string;
  telefono: string | null;
  mensaje: string;
}

export interface ChatbotResponse {
  response: string;
}

export interface ChatbotRequest {
  prompt: string;
}
