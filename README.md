# EcuApp — Sitio institucional

Sitio web público de EcuApp, publicado mediante **GitHub Pages**.

EcuApp se presenta como socio de ingeniería para otras organizaciones: software a medida, APIs B2B, MCP, interfaces propias e integración con sistemas existentes. El portafolio propio forma parte de la oferta, no la limita. Consulta [IDENTIDAD_ECUAPP.md](IDENTIDAD_ECUAPP.md) para la plataforma de marca.

- Sitio: https://ecuapp.github.io/
- Organización: https://github.com/EcuApp
- Contacto: ecuappmail@gmail.com

## Estructura

```text
.
├── index.html
├── assets/
│   ├── ecuapp-logo.png
│   ├── favicon.svg
│   ├── screens/
│   │   ├── hefesto-overview.webp
│   │   ├── hefesto-inventory.webp
│   │   └── hefesto-integrations.webp
│   ├── site.css
│   └── site.js
├── .github/
│   └── workflows/
│       └── pages.yml
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Funcionalidad del sitio

- Diseño adaptable a escritorio, tablet y móvil, con galería horizontal de capturas en teléfonos.
- Tema claro/oscuro con preferencia guardada localmente.
- Español e inglés con traducciones del catálogo y contenido técnico.
- Menús desplegables, navegación móvil y accesos directos.
- Logo corporativo original, paleta tomada de la marca y diagramas 2.5D con rutas animadas.
- Historia de interfaz con capturas reales de Hefesto, capas 2.5D y cambios de pantalla vinculados al scroll.
- Diagrama interactivo del ecosistema y fichas de producto.
- Catálogo con filtros por categoría.
- Buscador local instantáneo de productos y secciones.
- Animaciones de entrada, conexiones, transiciones y scroll storytelling con respeto a movimiento reducido.
- Servicios a medida, APIs B2B, MCP e integración con plataformas existentes destacados junto al portafolio propio.
- Ejemplos conceptuales de API B2B, MCP e interfaces con acción para copiar.
- Estado documentado del portafolio, sin telemetría ficticia ni SLA inventados.
- Formulario de consulta que prepara un correo; no provisiona cuentas ni emite credenciales.

## Publicación

El workflow `.github/workflows/pages.yml` construye y publica el contenido estático al hacer push a `main`.

En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La organización debe tener habilitado GitHub Pages para este repositorio. Después, revisa **Actions → Deploy EcuApp website** para verificar el resultado de cada publicación.

## Desarrollo local

No se necesita Node.js ni un proceso de compilación. El sitio es HTML, CSS y JavaScript estático.

```bash
python -m http.server 8000
```

Abre http://localhost:8000.

## Criterios de contenido

Las etapas de producto reflejan la evidencia documentada en los repositorios revisados. No deben interpretarse como disponibilidad comercial, certificación, uptime, SLA o resultados de producción. Los repositorios privados requieren permisos de organización.

© EcuApp. Todos los derechos reservados.
