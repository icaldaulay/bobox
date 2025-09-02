# 📚 Dokumentasi Lengkap: Bobox Unit Management Backend API

## 🎯 Target Pembaca

Dokumentasi ini ditujukan untuk developer yang sudah expert di PHP dan ingin memahami Node.js + TypeScript + Express.js untuk pertama kali.

---

## 📖 Daftar Isi

1. [Perbandingan dengan PHP](#perbandingan-dengan-php)
2. [Struktur Project](#struktur-project)
3. [Konsep Dasar TypeScript](#konsep-dasar-typescript)
4. [Alur Kerja Aplikasi](#alur-kerja-aplikasi)
5. [Penjelasan Setiap File](#penjelasan-setiap-file)
6. [Business Logic & Status Transition](#business-logic--status-transition)
7. [Testing Strategy](#testing-strategy)
8. [Cara Menjalankan Project](#cara-menjalankan-project)
9. [Troubleshooting](#troubleshooting)

---

## 🔄 Perbandingan dengan PHP

### Konsep Familiar untuk PHP Developer

| **Konsep**            | **PHP**                           | **Node.js + TypeScript**                  |
| --------------------- | --------------------------------- | ----------------------------------------- |
| **Entry Point**       | `index.php`                       | `src/index.ts`                            |
| **Routing**           | `.htaccess` + file structure      | Express Router                            |
| **Class/Object**      | `class User {}`                   | `interface User {}` + `class UserService` |
| **Dependency**        | `require_once` / Composer         | `import` / npm                            |
| **Array Associative** | `$data = ['key' => 'value']`      | `const data = { key: 'value' }`           |
| **Error Handling**    | `try/catch` + `throw`             | `try/catch` + `throw` (sama!)             |
| **HTTP Response**     | `header()` + `echo json_encode()` | `res.status().json()`                     |
| **Environment**       | `$_ENV` / `.env`                  | `process.env` / `.env`                    |

### Perbedaan Fundamental

```php
// PHP - Synchronous by default
$data = file_get_contents('api.json');
$result = json_decode($data, true);
echo json_encode($result);
```

```typescript
// Node.js - Asynchronous by default
const data = await fs.readFile("api.json", "utf8");
const result = JSON.parse(data);
res.json(result);
```

---

## 🏗️ Struktur Project

```
bobox-backend/
├── 📁 src/                    # Source code utama (seperti app/ di Laravel)
│   ├── 📁 controllers/        # HTTP request handlers (seperti Controllers di Laravel)
│   │   └── UnitController.ts  # Menangani semua endpoint /api/units
│   ├── 📁 models/            # Data types & interfaces (seperti Models di Laravel)
│   │   └── Unit.ts           # Interface untuk Unit object
│   ├── 📁 routes/            # Route definitions (seperti routes/web.php)
│   │   └── units.ts          # Routes untuk /api/units/*
│   ├── 📁 middleware/        # Custom middleware (seperti Middleware di Laravel)
│   │   └── errorHandler.ts   # Error handling global
│   ├── 📁 utils/             # Business logic & services (seperti Services di Laravel)
│   │   └── UnitService.ts    # Core business logic untuk Unit
│   └── index.ts              # Entry point aplikasi (seperti public/index.php)
├── 📁 tests/                 # Unit tests (seperti tests/ di Laravel)
│   ├── UnitService.test.ts   # Test untuk business logic
│   └── setup.ts              # Test configuration
├── 📁 dist/                  # Compiled JavaScript (seperti vendor/ di PHP)
├── package.json              # Dependencies (seperti composer.json)
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Test configuration
└── README.md                 # Dokumentasi
```

---

## 🔤 Konsep Dasar TypeScript

### 1. Type Safety (Keamanan Tipe Data)

**PHP (Loose Typing):**

```php
$user = ['name' => 'John', 'age' => 25];
$user['age'] = 'twenty-five'; // Runtime error mungkin terjadi
```

**TypeScript (Strong Typing):**

```typescript
interface User {
  name: string;
  age: number;
}

const user: User = { name: "John", age: 25 };
// user.age = 'twenty-five'; // Compile-time error!
```

### 2. Interface vs Class

```typescript
// Interface = Contract/Blueprint (seperti interface di PHP 8)
interface Unit {
  id: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  lastUpdated: string;
}

// Enum = Constants yang terbatas
enum UnitStatus {
  AVAILABLE = "Available",
  OCCUPIED = "Occupied",
  CLEANING_IN_PROGRESS = "Cleaning In Progress",
  MAINTENANCE_NEEDED = "Maintenance Needed",
}
```

### 3. Async/Await Pattern

**PHP:**

```php
public function getAllUnits(): array {
    $units = $this->db->query("SELECT * FROM units");
    return $units->fetchAll();
}
```

**TypeScript:**

```typescript
async getAllUnits(statusFilter?: UnitStatus): Promise<Unit[]> {
  // Async operations dapat di-await
  if (statusFilter) {
    return this.units.filter(unit => unit.status === statusFilter);
  }
  return [...this.units];
}
```

---

## ⚡ Alur Kerja Aplikasi

### 1. Request Flow (Alur Permintaan)

```
📱 Client Request → 🌐 Express Server → 🎯 Router → 🎮 Controller → 🔧 Service → 📊 Data → 📤 Response
```

**Contoh: GET /api/units**

1. **Client** mengirim HTTP GET ke `http://localhost:3001/api/units`
2. **Express Server** (`src/index.ts`) menerima request
3. **Router** (`src/routes/units.ts`) mengarahkan ke handler yang tepat
4. **Controller** (`src/controllers/UnitController.ts`) memproses request
5. **Service** (`src/utils/UnitService.ts`) menjalankan business logic
6. **Data** dikembalikan dalam format JSON
7. **Response** dikirim kembali ke client

### 2. Detailed Flow Diagram

```typescript
// 1. index.ts - Server Setup
app.use('/api/units', unitRoutes);

// 2. routes/units.ts - Route Mapping
router.get('/', UnitController.getAllUnits.bind(UnitController));

// 3. controllers/UnitController.ts - Request Processing
async getAllUnits(req: Request, res: Response): Promise<void> {
  const statusParam = req.query.status as string;
  const units = UnitService.getAllUnits(statusFilter);
  res.status(200).json({ success: true, data: units });
}

// 4. utils/UnitService.ts - Business Logic
getAllUnits(statusFilter?: UnitStatus): Unit[] {
  if (statusFilter) {
    return this.units.filter(unit => unit.status === statusFilter);
  }
  return [...this.units];
}
```

---

## 📄 Penjelasan Setiap File

### 1. `src/index.ts` - Entry Point Aplikasi

**Konsep PHP yang Setara:** `public/index.php` di Laravel

```typescript
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import unitRoutes from "./routes/units";

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Security middleware (seperti middleware di Laravel)
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(express.json()); // Parse JSON body (seperti php://input)

// Routes
app.use("/api/units", unitRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Penjelasan:**

- `express()` = Membuat instance web server (seperti Apache/Nginx)
- `middleware` = Function yang dijalankan untuk setiap request (seperti middleware Laravel)
- `app.use()` = Mendaftarkan middleware atau routes
- `app.listen()` = Start server di port tertentu

### 2. `src/models/Unit.ts` - Data Types & Interfaces

**Konsep PHP yang Setara:** Model class atau DTO (Data Transfer Object)

```typescript
// Enum = Konstanta yang terbatas (seperti const di PHP)
export enum UnitType {
  CAPSULE = "capsule",
  CABIN = "cabin",
}

export enum UnitStatus {
  AVAILABLE = "Available",
  OCCUPIED = "Occupied",
  CLEANING_IN_PROGRESS = "Cleaning In Progress",
  MAINTENANCE_NEEDED = "Maintenance Needed",
}

// Interface = Blueprint untuk object (seperti interface PHP 8)
export interface Unit {
  id: string; // UUID unique identifier
  name: string; // "Capsule-A01", "Forest-Cabin-2"
  type: UnitType; // "capsule" atau "cabin"
  status: UnitStatus; // salah satu dari 4 status
  lastUpdated: string; // ISO timestamp
}

// Request DTOs
export interface CreateUnitRequest {
  name: string;
  type: UnitType;
}

export interface UpdateUnitRequest {
  status: UnitStatus;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

**Penjelasan:**

- `interface` = Mendefinisikan struktur object (tidak bisa di-instantiate)
- `enum` = Kumpulan konstanta yang berkaitan
- `export` = Membuat tersedia untuk di-import (seperti public di PHP)
- `<T>` = Generic type (seperti templates di C++)

### 3. `src/utils/UnitService.ts` - Business Logic

**Konsep PHP yang Setara:** Service class atau Repository pattern

```typescript
import { v4 as uuidv4 } from "uuid";
import { Unit, UnitType, UnitStatus } from "../models/Unit";

class UnitService {
  private units: Unit[] = []; // In-memory storage (seperti static property)

  constructor() {
    this.initializeSampleData();
  }

  // Get all units dengan optional filter
  getAllUnits(statusFilter?: UnitStatus): Unit[] {
    if (statusFilter) {
      return this.units.filter((unit) => unit.status === statusFilter);
    }
    return [...this.units]; // Spread operator = array copy
  }

  // Create new unit
  createUnit(createRequest: CreateUnitRequest): Unit {
    const newUnit: Unit = {
      id: uuidv4(), // Generate UUID
      name: createRequest.name,
      type: createRequest.type,
      status: UnitStatus.AVAILABLE, // Default status
      lastUpdated: new Date().toISOString(),
    };

    this.units.push(newUnit);
    return newUnit;
  }

  // Update unit status dengan business rule validation
  updateUnitStatus(
    id: string,
    updateRequest: UpdateUnitRequest
  ): { success: boolean; unit?: Unit; error?: string } {
    const unitIndex = this.units.findIndex((unit) => unit.id === id);

    if (unitIndex === -1) {
      return { success: false, error: "Unit not found" };
    }

    const currentUnit = this.units[unitIndex];
    const newStatus = updateRequest.status;

    // 🔥 BUSINESS RULE: Cannot go directly Occupied → Available
    if (
      currentUnit.status === UnitStatus.OCCUPIED &&
      newStatus === UnitStatus.AVAILABLE
    ) {
      return {
        success: false,
        error: "Cannot change status directly from Occupied to Available.",
      };
    }

    // Update unit
    const updatedUnit: Unit = {
      ...currentUnit, // Spread operator = copy properties
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    };

    this.units[unitIndex] = updatedUnit;
    return { success: true, unit: updatedUnit };
  }
}

// Export singleton instance
export default new UnitService();
```

**Penjelasan Konsep:**

- `private` = Property hanya bisa diakses dalam class
- `?` = Optional parameter (bisa undefined)
- `...` = Spread operator untuk copy array/object
- `findIndex()` = Cari index element yang cocok condition
- Singleton pattern = Satu instance untuk seluruh aplikasi

### 4. `src/routes/units.ts` - Route Definitions

**Konsep PHP yang Setara:** `routes/api.php` di Laravel

```typescript
import { Router } from "express";
import UnitController from "../controllers/UnitController";

const router = Router();

// Map HTTP methods ke controller methods
router.get("/", UnitController.getAllUnits.bind(UnitController));
router.get("/:id", UnitController.getUnitById.bind(UnitController));
router.post("/", UnitController.createUnit.bind(UnitController));
router.put("/:id", UnitController.updateUnitStatus.bind(UnitController));

export default router;
```

**Penjelasan:**

- `Router()` = Instance untuk group routes
- `.bind()` = Ensure `this` context tetap benar (seperti `$this` di PHP)
- `/:id` = Route parameter (seperti `{id}` di Laravel routes)

### 5. `src/controllers/UnitController.ts` - HTTP Request Handlers

**Konsep PHP yang Setara:** Controller class di Laravel

```typescript
import { Request, Response } from "express";
import UnitService from "../utils/UnitService";

export class UnitController {
  // GET /api/units?status=Available
  async getAllUnits(req: Request, res: Response): Promise<void> {
    try {
      // Extract query parameter (seperti $_GET['status'])
      const statusParam = req.query.status as string;

      // Validation
      if (
        statusParam &&
        !Object.values(UnitStatus).includes(statusParam as UnitStatus)
      ) {
        const response: ApiResponse<never> = {
          success: false,
          error: `Invalid status parameter. Valid values are: ${Object.values(
            UnitStatus
          ).join(", ")}`,
        };
        res.status(400).json(response);
        return;
      }

      // Call service layer
      const units = UnitService.getAllUnits(statusParam as UnitStatus);

      // Return JSON response
      const response: ApiResponse<Unit[]> = {
        success: true,
        data: units,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  // POST /api/units
  async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const createRequest: CreateUnitRequest = req.body; // Seperti $_POST

      // Validation
      if (!createRequest.name || !createRequest.type) {
        res.status(400).json({
          success: false,
          error: "Name and type are required fields",
        });
        return;
      }

      // Call service
      const newUnit = UnitService.createUnit(createRequest);

      // Return created resource
      res.status(201).json({
        success: true,
        data: newUnit,
        message: "Unit created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export default new UnitController();
```

**Penjelasan Konsep:**

- `req.query` = Query parameters (?key=value)
- `req.params` = Route parameters (/:id)
- `req.body` = Request body (JSON)
- `res.status()` = Set HTTP status code
- `res.json()` = Send JSON response
- `async/await` = Handle asynchronous operations

### 6. `src/middleware/errorHandler.ts` - Error Handling

**Konsep PHP yang Setara:** Exception handler atau middleware Laravel

```typescript
import { Request, Response, NextFunction } from "express";

// Global error handler (seperti global exception handler)
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const response: ApiResponse<never> = {
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error" // Production: hide details
        : err.message, // Development: show details
  };

  res.status(err.status || 500).json(response);
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
```

---

## 🔄 Business Logic & Status Transition

### Aturan Bisnis Utama

**Problem:** Unit hotel tidak boleh langsung dari "Occupied" ke "Available" karena harus dibersihkan dulu.

**Solution:** Implementasi state machine dengan validation.

### State Transition Diagram

```
Available ──────────────────┐
    ↑                       ↓
    │                   Occupied
    │                       ↓
    │              ┌── Cleaning In Progress
    │              │        ↓
    └─────── Maintenance Needed
```

### Valid Transitions

```typescript
getValidNextStatuses(currentStatus: UnitStatus): UnitStatus[] {
  switch (currentStatus) {
    case UnitStatus.AVAILABLE:
      return [UnitStatus.OCCUPIED, UnitStatus.MAINTENANCE_NEEDED];

    case UnitStatus.OCCUPIED:
      return [UnitStatus.CLEANING_IN_PROGRESS, UnitStatus.MAINTENANCE_NEEDED];
      // TIDAK BOLEH langsung ke AVAILABLE!

    case UnitStatus.CLEANING_IN_PROGRESS:
      return [UnitStatus.AVAILABLE, UnitStatus.MAINTENANCE_NEEDED];

    case UnitStatus.MAINTENANCE_NEEDED:
      return [UnitStatus.AVAILABLE];

    default:
      return [];
  }
}
```

### Implementation dengan Error Handling

```typescript
updateUnitStatus(id: string, updateRequest: UpdateUnitRequest):
  { success: boolean; unit?: Unit; error?: string } {

  const currentUnit = this.getUnitById(id);
  if (!currentUnit) {
    return { success: false, error: 'Unit not found' };
  }

  // 🚨 CORE BUSINESS RULE
  if (currentUnit.status === UnitStatus.OCCUPIED &&
      updateRequest.status === UnitStatus.AVAILABLE) {
    return {
      success: false,
      error: 'Cannot change status directly from Occupied to Available. Unit must first be set to Cleaning In Progress or Maintenance Needed.'
    };
  }

  // Update jika valid
  const updatedUnit = {
    ...currentUnit,
    status: updateRequest.status,
    lastUpdated: new Date().toISOString()
  };

  return { success: true, unit: updatedUnit };
}
```

---

## 🧪 Testing Strategy

### Test Structure

```typescript
describe("UnitService - Status Transition Rules", () => {
  beforeEach(() => {
    // Reset state sebelum setiap test
    (UnitService as any).units = [];
  });

  describe("Business Rule: Cannot change directly from Occupied to Available", () => {
    test("should reject direct transition from Occupied to Available", () => {
      // Arrange: Setup test data
      const unit = UnitService.createUnit({
        name: "Test-Unit-01",
        type: UnitType.CAPSULE,
      });
      UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });

      // Act: Try invalid transition
      const result = UnitService.updateUnitStatus(unit.id, {
        status: UnitStatus.AVAILABLE,
      });

      // Assert: Should fail
      expect(result.success).toBe(false);
      expect(result.error).toContain(
        "Cannot change status directly from Occupied to Available"
      );
    });

    test("should allow valid transition path", () => {
      // Test: Occupied → Cleaning → Available
      const unit = UnitService.createUnit({
        name: "Test-Unit-02",
        type: UnitType.CABIN,
      });

      // Step 1: Available → Occupied
      UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });

      // Step 2: Occupied → Cleaning
      const step1 = UnitService.updateUnitStatus(unit.id, {
        status: UnitStatus.CLEANING_IN_PROGRESS,
      });
      expect(step1.success).toBe(true);

      // Step 3: Cleaning → Available
      const step2 = UnitService.updateUnitStatus(unit.id, {
        status: UnitStatus.AVAILABLE,
      });
      expect(step2.success).toBe(true);
    });
  });
});
```

### Test Categories

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test controller + service interaction
3. **Business Logic Tests** - Test transition rules
4. **Error Handling Tests** - Test error scenarios

---

## 🚀 Cara Menjalankan Project

### Prerequisites

```bash
# Install Node.js (versi 18 atau lebih tinggi)
# Download dari: https://nodejs.org/

# Verify installation
node --version
npm --version
```

### Setup Project

```bash
# 1. Navigate ke project directory
cd "c:\Users\icald\OneDrive\Desktop\bobox\backend"

# 2. Install dependencies
npm install

# 3. Build TypeScript to JavaScript
npm run build

# 4. Run tests
npm test

# 5. Start development server (dengan hot reload)
npm run dev

# 6. Start production server
npm start
```

### Development Workflow

```bash
# Development mode (recommended)
npm run dev
# → Server starts di http://localhost:3001
# → Auto-restart ketika file berubah
# → TypeScript compilation on-the-fly

# Testing
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode

# Production build
npm run build              # Compile TypeScript → JavaScript
npm start                  # Start production server
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

```bash
# Kill process di port 3001
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Atau gunakan port lain
PORT=3002 npm run dev
```

#### 2. TypeScript Compilation Errors

**Error:**

```
Cannot find name 'describe'. Do you need to install type definitions?
```

**Solution:**

```bash
# Install missing type definitions
npm install --save-dev @types/jest @types/node

# Rebuild project
npm run build
```

#### 3. Import/Export Issues

**Error:**

```
Cannot find module './UnitService'
```

**Solution:**

- Check file paths (case-sensitive di Linux/Mac)
- Ensure proper export/import syntax
- Check tsconfig.json module resolution

#### 4. CORS Issues (dari Frontend)

**Error:**

```
Access to fetch blocked by CORS policy
```

**Solution:**

- Check CORS configuration di `src/index.ts`
- Ensure frontend URL ada di whitelist
- Update environment variables

### Debugging Tips

#### 1. Console Logging

```typescript
// Add strategic console.log for debugging
console.log("Request received:", req.body);
console.log("Current unit status:", currentUnit.status);
console.log("Attempting transition to:", newStatus);
```

#### 2. Use VS Code Debugger

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/src/index.ts",
  "runtimeArgs": ["-r", "ts-node/register"],
  "env": {
    "NODE_ENV": "development"
  }
}
```

#### 3. Test Specific Functions

```bash
# Run specific test file
npm test -- UnitService.test.ts

# Run specific test case
npm test -- --testNamePattern="should reject direct transition"
```

---

## 📊 Performance Considerations

### Current Implementation

- **Storage:** In-memory (untuk development)
- **Scalability:** Single instance only
- **Data Persistence:** None (data hilang saat restart)

### Production Recommendations

```typescript
// 1. Database Integration
import { Pool } from "pg"; // PostgreSQL
// atau
import mongoose from "mongoose"; // MongoDB

// 2. Caching Layer
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL);

// 3. Request Rate Limiting
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// 4. Input Validation
import Joi from "joi";
const createUnitSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid("capsule", "cabin").required(),
});
```

### Security Best Practices

```typescript
// 1. Input Sanitization
import sanitize from "sanitize-html";

// 2. Authentication
import jwt from "jsonwebtoken";

// 3. Rate Limiting
import helmet from "helmet";
app.use(helmet());

// 4. HTTPS Only (production)
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

---

## 🎯 Next Steps & Enhancement Ideas

### Immediate Improvements

1. **Database Integration**

   ```typescript
   // Replace in-memory storage dengan PostgreSQL
   class UnitRepository {
     async findAll(filter?: UnitStatus): Promise<Unit[]> {
       const query = filter
         ? "SELECT * FROM units WHERE status = $1"
         : "SELECT * FROM units";
       const result = await this.db.query(query, filter ? [filter] : []);
       return result.rows;
     }
   }
   ```

2. **Authentication & Authorization**

   ```typescript
   // JWT middleware
   const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
     const token = req.header("Authorization")?.replace("Bearer ", "");
     if (!token) {
       return res.status(401).json({ error: "Access denied" });
     }
     // Verify JWT token
     next();
   };
   ```

3. **API Documentation**
   ```typescript
   // Swagger/OpenAPI integration
   import swaggerJSDoc from "swagger-jsdoc";
   import swaggerUi from "swagger-ui-express";
   ```

### Advanced Features

1. **Real-time Updates** (WebSocket)
2. **Audit Logging** (Track semua perubahan)
3. **Backup & Recovery**
4. **Monitoring & Metrics**
5. **Docker Containerization**

---

## 📚 Learning Resources

### Untuk PHP Developer yang Belajar Node.js

1. **TypeScript Handbook**: https://www.typescriptlang.org/docs/
2. **Express.js Guide**: https://expressjs.com/en/guide/
3. **Jest Testing**: https://jestjs.io/docs/getting-started
4. **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

### Recommended Reading Order

1. **Week 1:** TypeScript basics & syntax
2. **Week 2:** Express.js routing & middleware
3. **Week 3:** Testing dengan Jest
4. **Week 4:** Database integration & ORM

---

## 🤝 Support & Contributing

Jika ada pertanyaan atau butuh bantuan:

1. **Check dokumentasi ini dulu**
2. **Lihat error logs di terminal**
3. **Run tests untuk isolate masalah**
4. **Check browser developer tools untuk API calls**

### Common PHP → Node.js Migration Questions

**Q: Bagaimana cara handle sessions?**
A: Gunakan `express-session` atau JWT tokens

**Q: Apakah ada yang seperti Composer autoload?**
A: Ya, npm package management + ES6 imports

**Q: Bagaimana dengan database migrations?**
A: Gunakan tools seperti Knex.js atau TypeORM

**Q: Apakah ada yang seperti Laravel Eloquent?**
A: Ya, coba TypeORM, Sequelize, atau Prisma

---

🎉 **Selamat! Anda sudah memahami struktur dan alur kerja Node.js + TypeScript + Express.js aplikasi ini.**

Dokumentasi ini akan terus diupdate seiring development project. Happy coding! 🚀
