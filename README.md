# Bobox Unit Management Dashboard

**Technical Assessment - Aplikasi MERN Stack**

Aplikasi full-stack untuk mengelola unit hotel kapsul dan kabin mewah dengan aturan bisnis yang ketat.

---

## 📋 Daftar Isi

- [🚀 Instruksi Setup dan Menjalankan Aplikasi](#-instruksi-setup-dan-menjalankan-aplikasi)
- [🧪 Instruksi Testing](#-instruksi-testing)
- [🏗️ Penjelasan Arsitektur dan Pilihan Teknis](#️-penjelasan-arsitektur-dan-pilihan-teknis)
- [🔧 Justifikasi Implementasi Aturan Perubahan Status](#-justifikasi-implementasi-aturan-perubahan-status)

---

## 🚀 Instruksi Setup dan Menjalankan Aplikasi

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Setup Backend
```bash
cd backend
npm install
npm run dev
# Server: http://localhost:3001
```

### Setup Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

### Docker (Opsional)
```bash
docker-compose up -d
```

---

## 🧪 Instruksi Testing

### Backend Testing
```bash
cd backend
npm test              # Run tests
npm run test:coverage # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test              # Run tests
npm test -- --coverage # Coverage report
```

---

## 🏗️ Penjelasan Arsitektur dan Pilihan Teknis

### Arsitektur Aplikasi
```
React Frontend (Port 3000) ↔ Express API (Port 3001)
         ↓                           ↓
   TanStack Query              Business Logic
         ↓                           ↓
   React Components            In-Memory Storage
```

### Justifikasi Pilihan Teknologi

#### Backend: Node.js + Express + TypeScript
- **TypeScript**: Type safety dan developer experience
- **Express**: Framework lightweight dengan ecosystem besar
- **Jest**: Testing framework comprehensive

#### Frontend: React + TypeScript + TanStack Query
- **React 18**: Framework mature dengan community support
- **TanStack Query**: Modern data fetching dengan caching
- **TypeScript**: Konsistensi dengan backend

#### Storage: In-Memory
- **Simplicity**: Tidak perlu database setup untuk assessment
- **Performance**: Akses data sangat cepat
- **Focus**: Fokus pada business logic, bukan database config

---

## 🔧 Justifikasi Implementasi Aturan Perubahan Status

### Business Rules
```typescript
const VALID_TRANSITIONS = {
  AVAILABLE: ['OCCUPIED'],
  OCCUPIED: ['AVAILABLE', 'CLEANING'],
  CLEANING: ['AVAILABLE', 'MAINTENANCE'],
  MAINTENANCE: ['CLEANING']
};
```

### Justifikasi Aturan
1. **AVAILABLE → OCCUPIED**: Guest check-in process
2. **OCCUPIED → AVAILABLE**: Fast checkout (unit bersih)
3. **OCCUPIED → CLEANING**: Standard housekeeping
4. **CLEANING → AVAILABLE**: Cleaning selesai
5. **CLEANING → MAINTENANCE**: Issue ditemukan saat cleaning
6. **MAINTENANCE → CLEANING**: Repair selesai, perlu cleaning

### Implementasi Validasi
```typescript
export class UnitService {
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

### Keuntungan
- ✅ **Data Integrity**: Mencegah transisi status ilegal
- ✅ **Business Logic Consistency**: Aturan konsisten
- ✅ **Error Prevention**: User tidak bisa buat kesalahan
- ✅ **Audit Trail**: Setiap perubahan ter-track

---

## 📁 Struktur Proyek

```
bobox/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # HTTP handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── routes/          # API routes
│   ├── tests/               # Unit tests
│   └── README.md            # Backend docs
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API calls
│   └── README.md            # Frontend docs
└── README.md                # Project overview
```

---

## 🎯 Git Proficiency Demonstration

### Commit Strategy
- **Descriptive messages**: `feat:`, `fix:`, `docs:`, `test:`
- **Atomic commits**: Satu perubahan logis per commit
- **Incremental development**: Tidak ada single massive commit
- **25+ commits** dengan breakdown yang jelas

### Work Breakdown
1. **Foundation**: Project setup dan structure
2. **Backend**: API development dengan business logic
3. **Frontend**: React components dan state management
4. **Testing**: Unit dan integration tests
5. **Documentation**: Comprehensive docs

---

**Built with ❤️ untuk Bobobox Technical Assessment**

*Dokumentasi lengkap tersedia di `/backend/README.md` dan `/frontend/README.md`*
