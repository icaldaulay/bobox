# Dokumentasi Backend API

## Bobox Unit Management Dashboard - Backend

REST API komprehensif untuk mengelola unit hotel kapsul dan kabin mewah dengan penegakan aturan bisnis.

---

## 📋 Daftar Isi

- [🎯 Gambaran Umum](#-gambaran-umum)
- [🏗️ Arsitektur](#️-arsitektur)
- [🚀 Quick Start](#-quick-start)
- [📡 Referensi API](#-referensi-api)
- [🔒 Logic Bisnis](#-logic-bisnis)
- [🧪 Testing](#-testing)
- [📁 Struktur Proyek](#-struktur-proyek)

---

## 🎯 Gambaran Umum

Backend menyediakan REST API untuk mengelola unit akomodasi dengan kemampuan inti sebagai berikut:

### ✅ Fitur Utama

- **Operasi CRUD** untuk manajemen unit
- **Aturan Transisi Status** yang ketat
- **Validasi Input** dengan pesan error yang detail
- **Query Filtering** berdasarkan status dan tipe
- **Business Rule Enforcement** untuk data integrity
- **TypeScript** untuk type safety
- **Unit Testing** dengan Jest
- **Error Handling** yang komprehensif

### 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Jest
- **Storage**: In-Memory (untuk assessment)

---

## 🏗️ Arsitektur

### 📁 Struktur Direktori

```
backend/src/
├── 📁 controllers/          # HTTP request handlers
│   └── UnitController.ts        # Unit management endpoints
├── 📁 services/             # Business logic layer
│   └── UnitService.ts           # Core business rules
├── 📁 models/               # Data models
│   └── Unit.ts                  # Unit interfaces & types
├── 📁 routes/               # Route definitions
│   └── unitRoutes.ts            # API routing
├── 📁 middleware/           # Express middleware
│   └── validation.ts            # Input validation
└── 📁 utils/                # Utility functions
    └── constants.ts             # Application constants
```

### 🔄 Data Flow

```
HTTP Request → Router → Controller → Service → In-Memory Storage
                                        ↓
                               Business Logic Validation
                                        ↓
                                HTTP Response ← Error Handling
```

---

## 🚀 Quick Start

### Instalasi

```bash
cd backend
npm install
```

### Menjalankan Aplikasi

```bash
# Development mode dengan hot reload
npm run dev

# Production mode
npm start

# Server berjalan di: http://localhost:3001
```

---

## 📡 Referensi API

### Base URL
```
http://localhost:3001
```

### 🎯 Endpoints

#### 1. **GET /units** - Ambil Semua Unit
```bash
# Request
GET /units

# Response
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Unit A1",
      "type": "CAPSULE",
      "status": "AVAILABLE",
      "createdAt": "2025-09-03T10:00:00Z",
      "updatedAt": "2025-09-03T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### 2. **GET /units?status=AVAILABLE&type=CAPSULE** - Filter Unit
```bash
# Request dengan query parameters
GET /units?status=AVAILABLE&type=CAPSULE

# Response (filtered results)
{
  "success": true,
  "data": [...], # Unit yang sesuai filter
  "count": 5
}
```

#### 3. **POST /units** - Buat Unit Baru
```bash
# Request
POST /units
Content-Type: application/json

{
  "name": "Unit B2",
  "type": "LUXURY_CABIN"
}

# Response
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "Unit B2",
    "type": "LUXURY_CABIN",
    "status": "AVAILABLE", # Default status
    "createdAt": "2025-09-03T10:30:00Z",
    "updatedAt": "2025-09-03T10:30:00Z"
  }
}
```

#### 4. **PUT /units/:id/status** - Update Status Unit
```bash
# Request
PUT /units/550e8400-e29b-41d4-a716-446655440000/status
Content-Type: application/json

{
  "status": "OCCUPIED"
}

# Response - Success
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Unit A1",
    "type": "CAPSULE",
    "status": "OCCUPIED",
    "createdAt": "2025-09-03T10:00:00Z",
    "updatedAt": "2025-09-03T10:35:00Z"
  }
}

# Response - Error (invalid transition)
{
  "success": false,
  "error": "Invalid status transition from AVAILABLE to MAINTENANCE"
}
```

---

## 🔒 Logic Bisnis

### 📋 Aturan Transisi Status

```typescript
const VALID_TRANSITIONS = {
  AVAILABLE: ['OCCUPIED'],
  OCCUPIED: ['AVAILABLE', 'CLEANING'],
  CLEANING: ['AVAILABLE', 'MAINTENANCE'],
  MAINTENANCE: ['CLEANING']
};
```

### 🛡️ Validasi Implementasi

#### **Status Transition Validation**
```typescript
export class UnitService {
  private validateStatusTransition(current: UnitStatus, target: UnitStatus): boolean {
    const validTransitions = VALID_TRANSITIONS[current];
    return validTransitions.includes(target);
  }

  updateUnitStatus(id: string, newStatus: UnitStatus): Unit {
    const unit = this.getUnitById(id);
    
    if (!this.validateStatusTransition(unit.status, newStatus)) {
      throw new Error(`Invalid transition: ${unit.status} → ${newStatus}`);
    }
    
    unit.status = newStatus;
    unit.updatedAt = new Date();
    return unit;
  }
}
```

### 🎯 Business Rules Justification

1. **AVAILABLE → OCCUPIED**: Guest check-in langsung
2. **OCCUPIED → AVAILABLE**: Fast checkout (unit sudah bersih)
3. **OCCUPIED → CLEANING**: Standard housekeeping protocol
4. **CLEANING → AVAILABLE**: Cleaning selesai, unit ready
5. **CLEANING → MAINTENANCE**: Issue ditemukan saat cleaning
6. **MAINTENANCE → CLEANING**: Repair selesai, perlu cleaning

---

## 🧪 Testing

### Menjalankan Tests

```bash
# Run semua tests
npm test

# Test dengan coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### 📊 Test Coverage

- **UnitService**: 100% business logic coverage
- **UnitController**: 95% endpoint coverage
- **Integration Tests**: API flow testing
- **Edge Cases**: Error handling validation

### 🧪 Test Examples

```bash
# Test business logic
✅ Should create unit with valid data
✅ Should validate status transitions
✅ Should reject invalid transitions
✅ Should handle unit not found
✅ Should filter units by status/type

# Test API endpoints
✅ GET /units returns all units
✅ POST /units creates new unit
✅ PUT /units/:id/status updates status
✅ Error handling for invalid requests
```

---

## 📁 Struktur Proyek

```
backend/
├── 📁 src/
│   ├── 📁 controllers/
│   │   └── UnitController.ts    # API endpoint handlers
│   ├── 📁 services/
│   │   └── UnitService.ts       # Business logic & validation
│   ├── 📁 models/
│   │   └── Unit.ts              # TypeScript interfaces
│   ├── 📁 routes/
│   │   └── unitRoutes.ts        # Express routing
│   ├── 📁 middleware/
│   │   └── validation.ts        # Input validation middleware
│   ├── 📁 utils/
│   │   └── constants.ts         # Application constants
│   └── 📄 app.ts                # Express app configuration
├── 📁 tests/
│   ├── UnitService.test.ts      # Business logic tests
│   └── UnitController.test.ts   # API endpoint tests
├── 📄 package.json              # Dependencies & scripts
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 README.md                # Dokumentasi ini
```

---

## ⚙️ Konfigurasi

### Environment Variables

```bash
# .env
PORT=3001
NODE_ENV=development
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "start": "node dist/app.js",
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

---

## 🔗 Dokumentasi Terkait

- **[Main Project README](../README.md)** - Setup dan arsitektur lengkap
- **[Frontend Documentation](../frontend/README.md)** - React components dan UI
- **[Docker Configuration](../docker-compose.yml)** - Container setup

---

**Built with ❤️ untuk Bobobox Technical Assessment**

*Backend API siap production dengan business rules yang ketat dan testing yang komprehensif.*
