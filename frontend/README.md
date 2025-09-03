# Frontend - Bobox Unit Management

React SPA untuk dashboard manajemen unit hotel.

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

---

## 🧩 Komponen Utama

### 1. UnitsList.tsx - Main Dashboard
- ✅ Real-time data dengan auto-refresh
- ✅ Filter dan search functionality
- ✅ Summary statistics

### 2. UnitCard.tsx - Individual Unit
- ✅ Status visualization dengan color coding
- ✅ Interactive status updates
- ✅ Business rule validation

### 3. AddUnitForm.tsx - Create Unit
- ✅ Form validation
- ✅ Error handling
- ✅ Success feedback

### 4. FilterControls.tsx - Advanced Filter
- ✅ Multi-filter support
- ✅ Active filter tags
- ✅ Clear functionality

---

## 🔄 State Management

### React Query Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,      // 30 detik
      refetchOnWindowFocus: true,
    },
  },
});
```

### Custom Hooks
- **useUnits**: Data fetching dengan auto-refresh
- **useAddUnit**: Unit creation dengan optimistic updates
- **useUpdateUnit**: Status updates dengan error rollback

---

## 🎨 Design System

```css
/* Status Colors */
--status-available: #10b981;   /* Green */
--status-occupied: #ef4444;    /* Red */
--status-cleaning: #f59e0b;    /* Orange */
--status-maintenance: #6b7280; /* Gray */
```

---

## 🧪 Testing

```bash
npm test              # Run tests
npm test -- --coverage # Coverage report
```

### Test Coverage
- **Components**: UI rendering dan interactions
- **Hooks**: State management logic
- **Integration**: API communication

---

**Tech Stack**: React 18 + TypeScript + TanStack Query + Jest
