# Bobox Unit Management Dashboard

A comprehensive full-stack application for managing capsule hotels and luxury cabin units, built as part of Bobobox technical assessment.

## 🏗️ Architecture Overview

This application consists of two main components:

- **Backend API**: Node.js + Express + TypeScript RESTful API
- **Frontend SPA**: React + TypeScript single-page application

```
bobox/
├── backend/           # Node.js + Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript interfaces
│   │   └── index.ts       # Server entry point
│   ├── tests/             # Unit tests
│   └── package.json
├── frontend/          # React + TypeScript SPA
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript interfaces
│   │   └── App.tsx        # Main application
│   └── package.json
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd bobox
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Access Application

Open your browser and navigate to `http://localhost:3000`

## 🛠️ API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### 1. Get All Units

```http
GET /api/units
GET /api/units?status=Available
GET /api/units?type=capsule
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "Capsule-A01",
      "type": "capsule",
      "status": "Available",
      "lastUpdated": "2025-09-02T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

#### 2. Get Single Unit

```http
GET /api/units/:id
```

#### 3. Create New Unit

```http
POST /api/units
Content-Type: application/json

{
  "name": "Capsule-A01",
  "type": "capsule"
}
```

#### 4. Update Unit Status

```http
PUT /api/units/:id
Content-Type: application/json

{
  "status": "Occupied"
}
```

### Unit Object Schema

```typescript
interface Unit {
  id: string; // UUID
  name: string; // e.g., "Capsule-A01", "Forest-Cabin-2"
  type: "capsule" | "cabin";
  status:
    | "Available"
    | "Occupied"
    | "Cleaning In Progress"
    | "Maintenance Needed";
  lastUpdated: string; // ISO timestamp
}
```

## 🎯 Business Logic Implementation

### Status Transition Rules

The application implements strict business rules for unit status changes:

**❌ Invalid Transition:**

- `Occupied` → `Available` (Direct transition not allowed)

**✅ Valid Transitions:**

- `Occupied` → `Cleaning In Progress` → `Available`
- `Occupied` → `Maintenance Needed` → `Available`
- Any status → `Occupied` (for new bookings)
- `Available` → Any status

### Implementation Details

```typescript
// In UnitService.ts
private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  // Rule: Cannot go directly from Occupied to Available
  if (currentStatus === 'Occupied' && newStatus === 'Available') {
    return false;
  }
  return true;
}
```

This rule ensures operational workflow compliance:

1. **Occupied units** must be cleaned or maintained before becoming available
2. **Prevents skipping** essential cleaning/maintenance steps
3. **Maintains data integrity** for operational processes

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
npm test
```

**Test Coverage:**

- ✅ Unit creation and validation
- ✅ Status transition business rules
- ✅ Error handling for invalid transitions
- ✅ API endpoint functionality

### Frontend Testing

```bash
cd frontend
npm test
```

## 🏗️ Technical Choices & Justifications

### Backend Architecture

- **Node.js + Express**: Industry standard for rapid API development
- **TypeScript**: Type safety and better developer experience
- **In-Memory Storage**: Simplicity for assignment, easily replaceable with database
- **Service Layer Pattern**: Clean separation of business logic from HTTP concerns

### Frontend Architecture

- **React + TypeScript**: Modern, component-based UI development
- **TanStack React Query**: Efficient data fetching and caching
- **Custom Hooks**: Reusable logic for data management
- **CSS Modules Approach**: Scoped styling with maintainable CSS

### Key Design Decisions

1. **RESTful API Design**:

   - Standard HTTP methods and status codes
   - Consistent response format with `success`, `data`, `total` fields
   - Query parameter support for filtering

2. **Status Transition Validation**:

   - Implemented in service layer for reusability
   - Clear error messages for invalid transitions
   - Business rule enforcement at API level

3. **Frontend State Management**:

   - React Query for server state
   - Local state for UI interactions
   - Optimistic updates with error rollback

4. **Error Handling**:
   - Comprehensive error boundaries
   - User-friendly error messages
   - Graceful degradation for network issues

## 🎨 UI/UX Features

### Dashboard Features

- **Real-time Updates**: Automatic refresh capabilities
- **Visual Status Indicators**: Color-coded unit statuses
- **Responsive Design**: Works on desktop and mobile
- **Intuitive Filtering**: Easy-to-use status and type filters
- **Professional Styling**: Modern gradient design with clean typography

### User Experience

- **Loading States**: Skeleton loading for better perceived performance
- **Error Feedback**: Clear error messages with retry options
- **Form Validation**: Real-time validation with helpful hints
- **Status Transitions**: Dropdown with only valid status options

## 📋 Development Workflow

### Git Commit Strategy

```bash
# Feature development
git commit -m "feat: add API endpoint for unit creation"
git commit -m "feat: implement status transition validation"
git commit -m "feat: add unit filtering functionality"

# Frontend development
git commit -m "feat: create UnitCard component"
git commit -m "feat: implement unit status updates"
git commit -m "style: add responsive design and styling"

# Testing and fixes
git commit -m "test: add unit tests for status transitions"
git commit -m "fix: handle edge case in status validation"
git commit -m "docs: add comprehensive API documentation"
```

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
PORT=3001
NODE_ENV=development

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001
```

### Development vs Production

- **Development**: Hot reload, detailed error messages, debug logging
- **Production**: Optimized builds, error boundaries, performance monitoring

## 🚀 Deployment Options

### Option 1: Docker (Recommended)

```bash
docker-compose up
```

### Option 2: Manual Deployment

1. Build frontend: `cd frontend && npm run build`
2. Serve static files from backend
3. Configure reverse proxy (nginx)

### Option 3: Cloud Deployment

- **Backend**: Deploy to Heroku, Railway, or Vercel
- **Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
- **Database**: Upgrade to PostgreSQL or MongoDB

## 🔍 Code Quality Standards

### TypeScript Configuration

- Strict mode enabled
- No implicit any
- Comprehensive type definitions
- Interface-based architecture

### Code Organization

- **Single Responsibility**: Each module has one clear purpose
- **Dependency Injection**: Services are easily testable
- **Error Boundaries**: Graceful error handling throughout
- **Consistent Naming**: Clear, descriptive variable and function names

## 📈 Performance Considerations

### Backend Optimizations

- Efficient in-memory data structures
- Request validation middleware
- Proper HTTP status codes
- Minimal response payloads

### Frontend Optimizations

- React Query caching
- Component memoization where needed
- Lazy loading for large datasets
- Optimized re-renders

## 🛡️ Security Considerations

### Current Implementation

- Input validation on all endpoints
- Type safety with TypeScript
- CORS configuration for cross-origin requests

### Production Recommendations

- Add authentication/authorization
- Implement rate limiting
- Add request logging and monitoring
- Use HTTPS in production

## 🔄 Future Enhancements

### Phase 1: Core Improvements

- [ ] Real database integration (PostgreSQL)
- [ ] User authentication system
- [ ] Unit booking/reservation system
- [ ] Advanced filtering and search

### Phase 2: Advanced Features

- [ ] Real-time updates with WebSocket
- [ ] Mobile app development
- [ ] Analytics and reporting dashboard
- [ ] Integration with payment systems

### Phase 3: Scalability

- [ ] Microservices architecture
- [ ] Caching layer (Redis)
- [ ] Load balancing
- [ ] Monitoring and alerting

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is part of a technical assessment for Bobobox.

---

**Built with ❤️ for Bobobox Technical Assessment**

For questions or support, please contact the development team.
