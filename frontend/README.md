# Dokumentasi Frontend

## Bobox Unit Management Dashboard - Frontend

React TypeScript SPA modern untuk mengelola unit hotel kapsul dan kabin mewah dengan update real-time dan design responsif.

---

## 📋 Daftar Isi

- [🎯 Gambaran Umum](#-gambaran-umum)
- [🏗️ Arsitektur](#️-arsitektur)
- [🚀 Quick Start](#-quick-start)
- [🧩 Komponen](#-komponen)
- [🔄 State Management](#-state-management)
- [🎨 UI/UX Design](#-uiux-design)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)

---

## 🎯 Gambaran Umum

Frontend adalah aplikasi React modern yang menyediakan dashboard intuitif untuk mengelola unit akomodasi dengan sinkronisasi data real-time dan design UI yang profesional.

### ✅ Fitur Utama

- **Dashboard Real-time** dengan auto-refresh capabilities
- **Advanced Filtering** berdasarkan tipe unit dan status
- **Responsive Design** untuk desktop, tablet, dan mobile
- **Form Validation** dengan feedback yang user-friendly
- **Professional Styling** dengan modern gradient design
- **Error Handling** dengan graceful degradation
- **Loading States** untuk better user experience
- **TypeScript** untuk type safety di seluruh aplikasi

### 🛠️ Tech Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5+
- **Data Fetching**: TanStack React Query 5.59+
- **HTTP Client**: Axios 1.7+
- **Styling**: CSS3 dengan custom properties
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App dengan TypeScript

---

## 🏗️ Arsitektur

### 📁 Struktur Direktori

```
frontend/src/
├── 📁 components/           # React UI components
│   ├── UnitsList.tsx            # Main dashboard component
│   ├── UnitCard.tsx             # Individual unit display
│   ├── AddUnitForm.tsx          # Unit creation form
│   └── FilterControls.tsx       # Filter interface
├── 📁 hooks/                # Custom React hooks
│   ├── useUnits.ts              # Data fetching logic
│   ├── useAddUnit.ts            # Unit creation logic
│   └── useUpdateUnit.ts         # Status update logic
├── 📁 services/             # API communication
│   └── unitService.ts           # HTTP client wrapper
├── 📁 types/                # TypeScript definitions
│   └── Unit.ts                  # Data type interfaces
├── 📁 utils/                # Helper functions
│   └── colorStyles.ts           # UI styling utilities
├── 📄 App.tsx               # Main application component
├── 📄 App.css               # Global styling
└── 📄 index.tsx             # Application entry point
```

### 🔄 Data Flow Architecture

```
User Interaction → React Component
        ↓
Component → Custom Hook (useUnits, useAddUnit, etc.)
        ↓
Hook → React Query (Cache Management)
        ↓
React Query → Unit Service (HTTP Client)
        ↓
Unit Service → Backend API (Axios)
        ↓
API Response → React Query Cache → Component Update
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Backend API running on port 3001
```

### Instalasi & Setup

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Development mode (dengan hot reload)
npm start

# Production build
npm run build

# Run tests
npm test
```

### 🎯 Akses Aplikasi

```bash
# Development server
http://localhost:3000
```

---

## 🧩 Komponen

### 🏠 Overview Komponen Utama

#### 1. **UnitsList.tsx** - Main Dashboard Component

**Fitur Utama**:
- ✅ **Real-time data fetching** dengan auto-refresh
- ✅ **Filter integration** dengan FilterControls
- ✅ **Add unit toggle** dengan AddUnitForm
- ✅ **Units grouping** berdasarkan status
- ✅ **Summary statistics** display
- ✅ **Error handling** dengan retry functionality
- ✅ **Loading states** dengan skeleton UI

#### 2. **UnitCard.tsx** - Individual Unit Display

**Fitur Utama**:
- ✅ **Status visualization** dengan color-coded badges
- ✅ **Interactive status updates** via dropdown
- ✅ **Business rule validation** dengan error messages
- ✅ **Optimistic updates** untuk immediate feedback
- ✅ **Error rollback** ketika updates gagal
- ✅ **Loading states** selama status changes

#### 3. **AddUnitForm.tsx** - Unit Creation Form

**Fitur Utama**:
- ✅ **Real-time validation** dengan immediate feedback
- ✅ **Form error handling** dengan field-specific messages
- ✅ **Submit state management** dengan loading indicators
- ✅ **Success confirmation** dengan auto-close functionality
- ✅ **Cancel handling** dengan form reset
- ✅ **Accessibility** dengan proper ARIA labels

#### 4. **FilterControls.tsx** - Advanced Filtering Interface

**Fitur Utama**:
- ✅ **Multi-filter support** (status + type)
- ✅ **Active filter tags** dengan remove buttons
- ✅ **Filter statistics** showing result counts
- ✅ **Clear all filters** functionality
- ✅ **Responsive design** untuk mobile devices

---

## 🔄 State Management

### 🎯 React Query Integration

#### Query Client Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,      // 30 detik
      cacheTime: 300000,     // 5 menit
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});
```

### 🪝 Custom Hooks

#### **useUnits** - Data Fetching Hook

- ✅ **Automatic refetching** setiap 30 detik
- ✅ **Window focus refetch** untuk real-time sync
- ✅ **Stale time management** untuk performance
- ✅ **Error retry logic** dengan exponential backoff

#### **useAddUnit** - Unit Creation Hook

- ✅ **Optimistic updates** untuk immediate feedback
- ✅ **Cache invalidation** pada successful creation
- ✅ **Error handling** dengan user feedback
- ✅ **Loading state management**

#### **useUpdateUnit** - Status Update Hook

- ✅ **Optimistic updates** dengan immediate UI feedback
- ✅ **Error rollback** ke previous state
- ✅ **Cache synchronization** setelah mutations
- ✅ **Business rule validation** dengan error display

---

## 🎨 UI/UX Design

### 🎨 Design System

#### Color Palette

```css
:root {
  /* Status Colors */
  --status-available: #10b981;   /* Green */
  --status-occupied: #ef4444;    /* Red */
  --status-cleaning: #f59e0b;    /* Orange */
  --status-maintenance: #6b7280; /* Gray */

  /* Type Colors */
  --type-capsule: #8b5cf6;       /* Purple */
  --type-cabin: #059669;         /* Teal */
}
```

#### Interactive States

```css
.unit-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.unit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

---

## 📱 Responsive Design

### 🎯 Breakpoint System

```css
/* Mobile First Approach */
@media (min-width: 768px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
@media (min-width: 1280px) {
  /* Large Desktop */
}
```

### 📱 Mobile Optimizations

- ✅ **Responsive grid** yang menyesuaikan screen size
- ✅ **Touch-friendly** buttons dan interactions
- ✅ **Optimized spacing** untuk mobile devices
- ✅ **Readable typography** di semua ukuran

---

## 🧪 Testing

### 🎯 Testing Strategy

- ✅ **Component Rendering**: UI component output
- ✅ **User Interactions**: Click, form submission, input changes
- ✅ **API Integration**: Mock API responses dan error handling
- ✅ **State Management**: React Query cache behavior
- ✅ **Error Boundaries**: Error handling dan recovery
- ✅ **Accessibility**: ARIA labels dan keyboard navigation

### 🚀 Menjalankan Tests

```bash
# Run semua tests
npm test

# Run tests dengan coverage
npm test -- --coverage

# Run tests dalam watch mode
npm test -- --watch
```

---

## ⚙️ Konfigurasi

### 📦 Package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit"
  }
}
```

### 🌍 Environment Variables

```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_REFRESH_INTERVAL=30000

# .env.production
REACT_APP_API_URL=https://api.bobox.com
REACT_APP_REFRESH_INTERVAL=60000
```

---

## 🚀 Performance Optimizations

### ⚡ React Query Optimizations

- ✅ **Smart caching** dengan stale time management
- ✅ **Background refetching** untuk fresh data
- ✅ **Optimistic updates** untuk immediate feedback
- ✅ **Error retry logic** dengan exponential backoff

### 🎯 Component Optimizations

- ✅ **Memoized components** untuk prevent unnecessary re-renders
- ✅ **Optimized filter functions** dengan useMemo
- ✅ **Efficient state updates** dengan proper dependencies

---

## 📚 Dokumentasi Terkait

- **[Backend API Documentation](../backend/README.md)** - Complete API reference
- **[Main Project Overview](../README.md)** - Project setup dan arsitektur
- **[React Query Documentation](https://tanstack.com/query/latest)** - Data fetching library

---

**Built with ❤️ untuk Bobobox Technical Assessment**

*Frontend aplikasi dengan design modern, performance optimal, dan user experience yang excellent.*
