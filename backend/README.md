# Backend API - Bobox Unit Management

REST API untuk mengelola unit hotel kapsul dan kabin mewah.

---

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
# Server: http://localhost:3001
```

---

## 📡 API Endpoints

### 1. GET /units - Ambil Semua Unit
```bash
GET /units
# Filter: GET /units?status=AVAILABLE&type=CAPSULE
```

### 2. POST /units - Buat Unit Baru
```bash
POST /units
{
  "name": "Unit A1",
  "type": "CAPSULE"
}
```

### 3. PUT /units/:id/status - Update Status
```bash
PUT /units/:id/status
{
  "status": "OCCUPIED"
}
```

---

## 🔒 Business Rules

### Status Transitions
```typescript
AVAILABLE → OCCUPIED
OCCUPIED → AVAILABLE | CLEANING
CLEANING → AVAILABLE | MAINTENANCE
MAINTENANCE → CLEANING
```

### Validasi
- ✅ Invalid transitions akan error
- ✅ Input validation untuk semua endpoint
- ✅ Error handling yang comprehensive

---

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:coverage # Coverage report
```

### Test Coverage
- **UnitService**: 100% business logic
- **UnitController**: 95% endpoints
- **Integration**: API flow testing

---

**Tech Stack**: Node.js + Express + TypeScript + Jest
