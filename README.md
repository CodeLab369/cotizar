# NICMAT S.R.L. - Sistema de Cotización

Sistema de cotización web para la empresa NICMAT S.R.L., dedicada a la comercialización de baterías para vehículos.

## 🚀 Características

- **Sistema de autenticación** con credenciales por defecto
- **Panel de administración** con navegación lateral
- **Diseño responsivo** adaptado a todos los dispositivos
- **Notificaciones personalizadas** (no nativas del navegador)
- **Sistema modular** con código organizado
- **Almacenamiento local** para persistencia de datos
- **Formato de moneda boliviana** (Bs.) con separadores correctos

## 📋 Módulos

| Módulo | Estado |
|--------|--------|
| Inventario | 🔨 En desarrollo |
| Clientes | 🔨 En desarrollo |
| Cotizador | 🔨 En desarrollo |
| Configuraciones | 🔨 En desarrollo |

## 🔐 Credenciales por defecto

- **Usuario:** `Anahi`
- **Contraseña:** `2026`

## 💰 Formato de Moneda

El sistema utiliza el formato boliviano para moneda:
- **Símbolo:** Bs.
- **Separador de miles:** punto (.)
- **Separador decimal:** coma (,)
- **Ejemplo:** Bs. 1.500,50

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 con variables CSS (custom properties)
- JavaScript ES6+ (módulos)
- LocalStorage para persistencia
- GitHub Actions para CI/CD
- GitHub Pages para hosting

## 📁 Estructura del Proyecto

```
cotizar/
├── index.html              # Página principal
├── css/
│   ├── main.css            # Importador principal de estilos
│   ├── variables.css       # Variables CSS (tokens de diseño)
│   ├── base.css            # Estilos base y reset
│   ├── components/         # Componentes de UI
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   ├── notifications.css
│   │   ├── modal.css
│   │   ├── sidebar.css
│   │   └── header.css
│   └── pages/              # Estilos específicos de páginas
│       ├── login.css
│       └── dashboard.css
├── js/
│   ├── app.js              # Aplicación principal
│   ├── config.js           # Configuración global
│   ├── utils/              # Utilidades
│   │   ├── storage.js      # Gestión de LocalStorage
│   │   ├── currency.js     # Formateo de moneda
│   │   └── helpers.js      # Funciones auxiliares
│   ├── components/         # Componentes JS
│   │   ├── notifications.js
│   │   ├── modal.js
│   │   ├── sidebar.js
│   │   └── header.js
│   ├── services/           # Servicios
│   │   └── auth.js         # Autenticación
│   └── pages/              # Páginas
│       ├── login.js
│       ├── inventory.js
│       ├── clients.js
│       ├── quoter.js
│       └── settings.js
└── .github/
    └── workflows/
        └── deploy.yml      # Workflow de GitHub Actions
```

## 🚀 Despliegue

El proyecto se despliega automáticamente en GitHub Pages mediante GitHub Actions.

### Pasos para configurar:

1. Crear repositorio en GitHub
2. Subir el código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. Ir a **Settings > Pages** en el repositorio
4. En **Source**, seleccionar **GitHub Actions**
5. El workflow se ejecutará automáticamente

## 📝 Desarrollo Local

Para ejecutar localmente, puedes usar cualquier servidor web estático:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (npx serve)
npx serve

# Con VS Code Live Server
# Instalar extensión "Live Server" y hacer clic en "Go Live"
```

Luego abre `http://localhost:8000` en tu navegador.

## 📄 Licencia

© 2026 NICMAT S.R.L. Todos los derechos reservados.
