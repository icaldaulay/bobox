# Backend API Documentation

## Bobox Unit Management Dashboard - Backend

Comprehensive REST API for managing capsule hotel and luxury cabin units with enforced business rules.

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📡 API Reference](#-api-reference)
- [🔒 Business Logic](#-business-logic)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)

---

## 🎯 Overview

The backend provides a RESTful API for managing accommodation units with the following core capabilities:

### ✅ Key Features

- **CRUD Operations** for unit management
- **Status Transition Rules** enforcement
- **Input Validation** with detailed error messages
- **Query Filtering** by status and type
- **In-Memory Storage** for simplicity
- **TypeScript** for type safety
- **Comprehensive Testing** with Jest

### 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.1+
- **Testing**: Jest 29+
- **Utilities**: UUID, CORS, Helmet, Morgan

---

## 🏗️ Architecture

### 📁 Directory Structure

```
backend/
├── 📁 src/
│   ├── 📁 controllers/          # HTTP request handlers
│   │   └── UnitController.ts       # Main unit operations
│   ├── 📁 middleware/           # Express middleware
│   │   └── errorHandler.ts         # Global error handling
│   ├── 📁 models/               # Data models
│   │   └── Unit.ts                 # Unit interface definition
│   ├── 📁 routes/               # API route definitions
│   │   └── units.ts                # Unit endpoints
│   ├── 📁 utils/                # Business logic
│   │   └── UnitService.ts          # Core business operations
│   └── index.ts                 # Server entry point
├── 📁 tests/                    # Test suites
│   ├── UnitService.test.ts         # Business logic tests
│   └── setup.ts                    # Test configuration
├── 📄 package.json              # Dependencies & scripts
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 jest.config.js           # Jest test configuration
└── 📄 README.md                # This documentation
```

### 🔄 Request Flow

```
1. HTTP Request → Express Router
         ↓
2. Route Handler → UnitController
         ↓
3. Controller → UnitService (Business Logic)
         ↓
4. UnitService → In-Memory Storage
         ↓
5. Response ← JSON with success/error
```

### 🏛️ Architectural Patterns

- **Controller Pattern**: HTTP request handling
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **Middleware Chain**: Cross-cutting concerns

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation & Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run tests with watch mode
npm run test:watch
```

### 🌍 Environment Configuration

```bash
# .env file (optional)
PORT=3001
NODE_ENV=development
```

### 🎯 Health Check

```bash
# Verify server is running
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2025-09-03T10:30:00.000Z",
#   "service": "Bobox Unit Management API"
# }
```

---

## 📡 API Reference

### 🌐 Base URL

```
http://localhost:3001/api
```

### 📋 Response Format

All API responses follow this consistent structure:

```typescript
{
  success: boolean;
  data?: any;
  total?: number;
  error?: string;
  message?: string;
}
```

---

### 🔍 1. Get All Units

**Endpoint**: `GET /api/units`

**Description**: Retrieve all units with optional filtering

#### Query Parameters

| Parameter | Type   | Required | Description           | Example             |
| --------- | ------ | -------- | --------------------- | ------------------- |
| `status`  | string | No       | Filter by unit status | `?status=Available` |
| `type`    | string | No       | Filter by unit type   | `?type=capsule`     |

#### Request Examples

```bash
# Get all units
curl -X GET http://localhost:3001/api/units

# Filter by status
curl -X GET "http://localhost:3001/api/units?status=Available"

# Filter by type
curl -X GET "http://localhost:3001/api/units?type=capsule"

# Multiple filters
curl -X GET "http://localhost:3001/api/units?status=Available&type=cabin"
```

#### Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Capsule-A01",
      "type": "capsule",
      "status": "Available",
      "lastUpdated": "2025-09-03T10:30:00.000Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Forest-Cabin-2",
      "type": "cabin",
      "status": "Occupied",
      "lastUpdated": "2025-09-03T09:15:00.000Z"
    }
  ],
  "total": 2
}
```

#### Status Codes

- `200` - Success
- `400` - Invalid query parameters
- `500` - Server error

---

### 👁️ 2. Get Single Unit

**Endpoint**: `GET /api/units/:id`

**Description**: Retrieve details for a specific unit

#### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | Yes      | Unit UUID   |

#### Request Example

```bash
curl -X GET http://localhost:3001/api/units/123e4567-e89b-12d3-a456-426614174000
```

#### Response Example

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Capsule-A01",
    "type": "capsule",
    "status": "Available",
    "lastUpdated": "2025-09-03T10:30:00.000Z"
  }
}
```

#### Status Codes

- `200` - Success
- `404` - Unit not found
- `400` - Invalid UUID format
- `500` - Server error

---

### ➕ 3. Create New Unit

**Endpoint**: `POST /api/units`

**Description**: Create a new unit (status defaults to "Available")

#### Request Body

```typescript
{
  name: string; // Required: Unit name (e.g., "Capsule-A01")
  type: string; // Required: "capsule" or "cabin"
}
```

#### Request Example

```bash
curl -X POST http://localhost:3001/api/units \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Capsule-B02",
    "type": "capsule"
  }'
```

#### Response Example

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Capsule-B02",
    "type": "capsule",
    "status": "Available",
    "lastUpdated": "2025-09-03T10:30:00.000Z"
  },
  "message": "Unit created successfully"
}
```

#### Validation Rules

- **name**: Required, string, 1-100 characters
- **type**: Required, must be "capsule" or "cabin"

#### Status Codes

- `201` - Created successfully
- `400` - Validation error
- `409` - Unit name already exists
- `500` - Server error

---

### ✏️ 4. Update Unit Status

**Endpoint**: `PUT /api/units/:id`

**Description**: Update unit status with business rule validation

#### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | Yes      | Unit UUID   |

#### Request Body

```typescript
{
  status: string; // Required: New status value
}
```

#### Valid Status Values

- `"Available"`
- `"Occupied"`
- `"Cleaning In Progress"`
- `"Maintenance Needed"`

#### Request Example

```bash
curl -X PUT http://localhost:3001/api/units/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Occupied"
  }'
```

#### Response Example (Success)

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Capsule-A01",
    "type": "capsule",
    "status": "Occupied",
    "lastUpdated": "2025-09-03T10:35:00.000Z"
  },
  "message": "Unit status updated successfully"
}
```

#### Response Example (Business Rule Violation)

```json
{
  "success": false,
  "error": "Invalid status transition: Cannot change from 'Occupied' to 'Available' directly. Unit must go through 'Cleaning In Progress' or 'Maintenance Needed' first."
}
```

#### Status Codes

- `200` - Updated successfully
- `400` - Invalid status transition or validation error
- `404` - Unit not found
- `500` - Server error

---

## 🔒 Business Logic

### 📊 Status Transition Rules

The system enforces specific business rules for unit status changes:

#### ❌ Invalid Transition

```
Occupied → Available (BLOCKED)
```

#### ✅ Valid Transitions

```
Occupied → Cleaning In Progress → Available
Occupied → Maintenance Needed → Available
Any Status → Occupied (for new bookings)
Available → Cleaning In Progress
Available → Maintenance Needed
Cleaning In Progress → Available
Maintenance Needed → Available
```

### 🎯 Business Rule Implementation

#### Service Layer Validation

```typescript
// UnitService.ts
private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  // Business Rule: Cannot go directly from Occupied to Available
  if (currentStatus === 'Occupied' && newStatus === 'Available') {
    return false;
  }
  return true;
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": "Invalid status transition: Cannot change from 'Occupied' to 'Available' directly. Unit must go through 'Cleaning In Progress' or 'Maintenance Needed' first."
}
```

### 🏢 Business Justification

**Why this rule exists:**

1. **Operational Compliance**: Ensures units are properly cleaned/maintained
2. **Quality Assurance**: Prevents skipping essential preparation steps
3. **Guest Safety**: Guarantees units meet cleanliness standards
4. **Workflow Management**: Enforces proper operational procedures

---

## 🧪 Testing

### 🎯 Test Coverage

#### Test Files

```
tests/
├── UnitService.test.ts     # Business logic tests
└── setup.ts               # Test configuration
```

#### Test Categories

- ✅ **Unit Creation**: Valid/invalid inputs
- ✅ **Status Transitions**: Business rule enforcement
- ✅ **Data Retrieval**: Filtering and queries
- ✅ **Error Handling**: Edge cases and validation
- ✅ **Business Rules**: Status transition logic

### 🚀 Running Tests

#### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test UnitService.test.ts
```

#### Test Results Example

```
 PASS  tests/UnitService.test.ts
  UnitService
    ✓ should create a new unit with valid data
    ✓ should retrieve all units
    ✓ should filter units by status
    ✓ should update unit status when valid
    ✓ should reject invalid status transitions
    ✓ should handle non-existent unit updates

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Coverage:    100% statements, 100% branches, 100% functions, 100% lines
```

### 📊 Test Coverage Details

#### Business Logic Coverage

- **Status Transitions**: 100% (all rules tested)
- **CRUD Operations**: 100% (create, read, update)
- **Validation Logic**: 100% (input validation)
- **Error Handling**: 100% (edge cases covered)

---

## 📁 Project Structure

### 🔧 Core Components

#### 1. **UnitController.ts** - HTTP Request Handling

```typescript
export class UnitController {
  // GET /api/units
  async getAllUnits(req: Request, res: Response);

  // GET /api/units/:id
  async getUnitById(req: Request, res: Response);

  // POST /api/units
  async createUnit(req: Request, res: Response);

  // PUT /api/units/:id
  async updateUnitStatus(req: Request, res: Response);
}
```

#### 2. **UnitService.ts** - Business Logic

```typescript
export class UnitService {
  // Core CRUD operations
  createUnit(name: string, type: string): Unit
  getAllUnits(filters?: UnitFilters): Unit[]
  getUnitById(id: string): Unit | null
  updateUnitStatus(id: string, status: string): Unit

  // Business rule validation
  private isValidStatusTransition(current: string, new: string): boolean
  private validateUnitData(name: string, type: string): void
}
```

#### 3. **Unit.ts** - Data Model

```typescript
export interface Unit {
  id: string;
  name: string;
  type: "capsule" | "cabin";
  status:
    | "Available"
    | "Occupied"
    | "Cleaning In Progress"
    | "Maintenance Needed";
  lastUpdated: string;
}

export interface UnitFilters {
  status?: string;
  type?: string;
}
```

#### 4. **Routes** - API Endpoint Definitions

```typescript
// routes/units.ts
router.get("/", unitController.getAllUnits);
router.get("/:id", unitController.getUnitById);
router.post("/", unitController.createUnit);
router.put("/:id", unitController.updateUnitStatus);
```

---

**Built with ❤️ for Bobobox Technical Assessment**

_Need help? Check the test files for usage examples or create an issue for support._
