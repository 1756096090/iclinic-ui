# iClinic UI - CRM Omnicanal Frontend

Angular 21 standalone components frontend para iClinic - Gestión CRM omnicanal (Telegram, WhatsApp, etc.) para clínicas dentales.

**Stack:** Angular 21 | Signals | OnPush (ChangeDetection) | Material Design | Reactive Forms | TypeScript (Strict)

---

## 🚀 Inicio Rápido

### **1. Instalar dependencias**
```bash
npm install
```

### **2. Configurar API Backend**
Edita `public/env.json`:
```json
{
  "apiBaseUrl": "http://localhost:8080/api/v1"
}
```

Para desarrollo con ngrok (backend expuesto):
```json
{
  "apiBaseUrl": "https://xxxxx.ngrok-free.app/api/v1"
}
```

### **3. Ejecutar desarrollo**
```bash
npm start
# O equivalentemente:
ng serve
```

Abre http://localhost:4200

---

## 📱 Canales - Integración Telegram

### **Flujo: Conectar Bot de Telegram**

**Página:** Menú → Canales

**Paso 1: Clic en "Nuevo canal"**
```
Abre formulario de creación
```

**Paso 2: Seleccionar Telegram**
```
- Tipo de Canal: Telegram
- Proveedor: Telegram
```

**Paso 3: Ingresar credenciales**
```
Token del Bot: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
URL Base del Webhook: https://xxxxx.ngrok-free.app
Token de Verificación: webhook_secret_123
```

**Paso 4: Clic en "Conectar Canal"**
```
- Frontend valida formulario
- Llama a POST /api/v1/crm/channels
- Backend valida token
- Backend registra webhook automáticamente en Telegram
- Status se muestra como "Activo" ✅
```

### **Campos del Formulario (Telegram)**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **Tipo de Canal** | Select | ✅ | TELEGRAM |
| **Proveedor** | Select | ✅ | TELEGRAM |
| **Token del Bot** | Input (password) | ✅ | De @BotFather |
| **URL Base Webhook** | Input (URL) | ✅ | ngrok: `https://xxxxx.ngrok-free.app` |
| **Token de Verificación** | Input (password) | ✅ | Seguridad del webhook |

### **Contrato API (Backend)**

**Endpoint:** `POST /api/v1/crm/channels`

**Request:**
```json
{
  "companyId": 1,
  "branchId": 1,
  "channelType": "TELEGRAM",
  "provider": "TELEGRAM",
  "externalAccountId": "1234567890",
  "accessToken": "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh",
  "webhookVerifyToken": "webhook_secret_123",
  "webhookBaseUrl": "https://xxxxx.ngrok-free.app"
}
```

**Response (Success 201):**
```json
{
  "id": 1,
  "branchId": 1,
  "channelType": "TELEGRAM",
  "provider": "TELEGRAM",
  "externalAccountId": "1234567890",
  "status": "ACTIVE",
  "createdAt": "2026-03-29T23:46:00"
}
```

**Response (Error 400/500):**
```json
{
  "error": "Invalid Telegram bot token",
  "timestamp": "2026-03-29T23:46:00"
}
```

---

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/
│   ├── services/
│   │   └── http.service.ts       → HTTP client wrapper
│   ├── guards/
│   ├── interceptors/             → Auth, Error handling
│   └── models/
│       └── api-endpoints.ts      → Constantes de endpoints
├── shared/
│   ├── components/               → Componentes reutilizables
│   ├── pipes/                    → Filtros personalizados
│   └── utils/
├── modules/
│   ├── channel-connections/      → Integración de canales
│   │   ├── pages/
│   │   │   └── channel-connections.page.ts
│   │   ├── components/
│   │   │   ├── channel-list.component.ts       → Lista de canales
│   │   │   └── channel-form.component.ts       → Formulario crear/editar
│   │   ├── services/
│   │   │   └── channel-connection.service.ts   → HTTP calls
│   │   └── models/
│   │       ├── channel-connection.enums.ts     → Tipos
│   │       └── channel-connection.models.ts    → DTOs
│   ├── conversations/            → Listado de conversaciones
│   ├── messages/                 → Envío/recepción de mensajes
│   ├── companies/
│   ├── branches/
│   ├── users/
│   └── dashboard/
└── app.routes.ts                 → Routing lazy-loaded

```

---

## 🔧 Desarrollo

### **Crear componente nuevo**
```bash
ng generate component modules/mi-modulo/components/mi-componente
```

### **Crear servicio nuevo**
```bash
ng generate service modules/mi-modulo/services/mi-servicio
```

### **Ejecutar tests**
```bash
npm test
# O:
ng test
```

### **Build producción**
```bash
npm run build
# O:
ng build --configuration production
```

---

## 📋 Módulos Disponibles

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| **Canales** | `/channels` | Conectar Telegram, WhatsApp, etc. |
| **Empresas** | `/companies` | Gestionar empresas |
| **Sucursales** | `/branches` | Sucursales por empresa |
| **Usuarios** | `/users` | Personal de clínica |
| **Conversaciones** | `/conversations` | Historial de chats por canal |
| **Mensajes** | `/messages` | Envío/recepción omnicanal |
| **Dashboard** | `/dashboard` | Estadísticas y resumen |

---

## 🎯 Patrones Arquitectónicos

### **Signals (Angular 17+)**
```typescript
// Estado reactivo
readonly channels = signal<ChannelConnectionResponseDto[]>([]);

// Actualizar
channels.set(newChannels);
channels.update(list => [...list, newChannel]);
```

### **OnPush Change Detection**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Solo actualiza cuando inputs cambian o eventos emiten
})
```

### **Standalone Components**
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule],
  // No necesita NgModule
})
```

### **Reactive Forms**
```typescript
form = this.fb.group({
  channelType: ['TELEGRAM', Validators.required],
  accessToken: ['', [Validators.required, Validators.minLength(30)]],
});
```

---

## ⚙️ Configuración

### **API Base URL**
- Archivo: `public/env.json`
- Cargado en: `src/main.ts`
- Inyectado en: `HttpService`

### **Variables de Entorno (Build)**
```bash
# Development
ng serve

# Production
ng build --configuration production
```

---

## 🐛 Debugging

### **Ver logs del servicio HTTP**
```typescript
// En http.service.ts, descomentar logs en get/post/put/delete
console.log('Request:', method, url, body);
console.log('Response:', response);
```

### **Inspeccionar Signals**
```typescript
// En Component
console.log(this.channels()); // Lee el valor
```

---

## 📚 Additional Resources

- [Angular Docs](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Material Design](https://material.angular.io)
- [RxJS Operators](https://rxjs.dev/guide/operators)

# iclinic-ui
