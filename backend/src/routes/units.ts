import { Router } from 'express';
import UnitController from '../controllers/UnitController';

const router = Router();

// GET /api/units - Fetches all units with optional status filter
router.get('/', UnitController.getAllUnits.bind(UnitController));

// GET /api/units/:id - Gets details for a single unit
router.get('/:id', UnitController.getUnitById.bind(UnitController));

// POST /api/units - Creates a new unit
router.post('/', UnitController.createUnit.bind(UnitController));

// PUT /api/units/:id - Updates a unit's status
router.put('/:id', UnitController.updateUnitStatus.bind(UnitController));

export default router;
