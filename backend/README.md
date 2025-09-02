# Bobox Unit Management Dashboard - Backend API

A RESTful API for managing Bobox capsule hotel and cabin units. This backend service handles unit status tracking with business logic enforcement for status transitions.

## Features

- 🏨 **Unit Management**: Create and manage capsules and cabins
- 🔄 **Status Tracking**: Track unit availability and maintenance states
- 🛡️ **Business Logic**: Enforced status transition rules
- 🔍 **Filtering**: Query units by status and type
- ✅ **Validation**: Input validation and error handling
- 🧪 **Testing**: Comprehensive test suite for business logic

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## API Endpoints

### Units Management

| Method | Endpoint         | Description        | Query Parameters    |
| ------ | ---------------- | ------------------ | ------------------- |
| GET    | `/api/units`     | Get all units      | `?status=Available` |
| GET    | `/api/units/:id` | Get unit by ID     | -                   |
| POST   | `/api/units`     | Create new unit    | -                   |
| PUT    | `/api/units/:id` | Update unit status | -                   |

### Unit Object Schema

```json
{
  "id": "string (UUID)",
  "name": "string (e.g., 'Capsule-A01')",
  "type": "capsule | cabin",
  "status": "Available | Occupied | Cleaning In Progress | Maintenance Needed",
  "lastUpdated": "string (ISO timestamp)"
}
```

## Business Rules

### Status Transition Logic

**Key Rule**: A unit cannot transition directly from `Occupied` to `Available`. It must first go through `Cleaning In Progress` or `Maintenance Needed`.

#### Valid Transitions

- **Available** → `Occupied`, `Maintenance Needed`
- **Occupied** → `Cleaning In Progress`, `Maintenance Needed`
- **Cleaning In Progress** → `Available`, `Maintenance Needed`
- **Maintenance Needed** → `Available`

#### Invalid Transition

- **Occupied** → ❌ `Available` (Direct transition blocked)

#### Valid Sequences

- `Occupied` → `Cleaning In Progress` → `Available` ✅
- `Occupied` → `Maintenance Needed` → `Available` ✅

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env file as needed
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

Server will start on http://localhost:3001 with hot reload.

### Production Mode

```bash
npm run build
npm start
```

### Health Check

Visit http://localhost:3001/health to verify the API is running.

## Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Test Coverage

Tests focus on the critical business logic for status transitions:

- ✅ Direct Occupied → Available rejection
- ✅ Valid transition sequences
- ✅ Edge cases and error handling

## API Usage Examples

### Get All Units

```bash
curl -X GET "http://localhost:3001/api/units"
```

### Filter by Status

```bash
curl -X GET "http://localhost:3001/api/units?status=Available"
```

### Create New Unit

```bash
curl -X POST "http://localhost:3001/api/units" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Capsule-A03",
    "type": "capsule"
  }'
```

### Update Unit Status

```bash
curl -X PUT "http://localhost:3001/api/units/[unit-id]" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Occupied"
  }'
```

### Invalid Status Transition (Returns 400 Error)

```bash
curl -X PUT "http://localhost:3001/api/units/[occupied-unit-id]" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Available"
  }'
```

## API Response Format

All endpoints return responses in this format:

```json
{
  "success": boolean,
  "data": object | array,
  "message": "string (optional)",
  "error": "string (optional)"
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, invalid transitions)
- `404` - Not Found
- `500` - Internal Server Error

## Data Storage

Currently uses **in-memory storage** with sample data initialization. For production, this can be easily replaced with:

- PostgreSQL
- MongoDB
- SQLite
- Any other database of choice

## Architecture

```
src/
├── controllers/     # HTTP request handlers
├── models/         # Data types and interfaces
├── routes/         # API route definitions
├── middleware/     # Custom middleware (error handling, logging)
├── utils/          # Business logic and services
└── index.ts        # Application entry point
```

## Development Notes

- **TypeScript**: Full type safety with strict mode enabled
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request logging with Morgan
- **Security**: Basic security headers with Helmet
- **CORS**: Configured for frontend integration
- **Validation**: Input validation on all endpoints

## Future Enhancements

- [ ] Database integration
- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Caching layer
- [ ] Monitoring and metrics
- [ ] Docker containerization
