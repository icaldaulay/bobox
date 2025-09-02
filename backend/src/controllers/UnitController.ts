import { Request, Response } from 'express';
import UnitService from '../utils/UnitService';
import { UnitStatus, UnitType, CreateUnitRequest, UpdateUnitRequest, ApiResponse, Unit } from '../models/Unit';

export class UnitController {
  // GET /api/units - Fetches all units with optional status filter
  async getAllUnits(req: Request, res: Response): Promise<void> {
    try {
      const statusParam = req.query.status as string;
      let statusFilter: UnitStatus | undefined;

      // Validate status parameter if provided
      if (statusParam) {
        if (Object.values(UnitStatus).includes(statusParam as UnitStatus)) {
          statusFilter = statusParam as UnitStatus;
        } else {
          const response: ApiResponse<never> = {
            success: false,
            error: `Invalid status parameter. Valid values are: ${Object.values(UnitStatus).join(', ')}`
          };
          res.status(400).json(response);
          return;
        }
      }

      const units = UnitService.getAllUnits(statusFilter);
      
      const response: ApiResponse<Unit[]> = {
        success: true,
        data: units
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  // GET /api/units/:id - Gets details for a single unit
  async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Unit ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const unit = UnitService.getUnitById(id);
      
      if (!unit) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Unit not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Unit> = {
        success: true,
        data: unit
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  // POST /api/units - Creates a new unit
  async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const createRequest: CreateUnitRequest = req.body;
      
      // Validate required fields
      if (!createRequest.name || !createRequest.type) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Name and type are required fields'
        };
        res.status(400).json(response);
        return;
      }

      // Validate unit type
      if (!Object.values(UnitType).includes(createRequest.type as UnitType)) {
        const response: ApiResponse<never> = {
          success: false,
          error: `Invalid unit type. Valid values are: capsule, cabin`
        };
        res.status(400).json(response);
        return;
      }

      const newUnit = UnitService.createUnit(createRequest);
      
      const response: ApiResponse<Unit> = {
        success: true,
        data: newUnit,
        message: 'Unit created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/units/:id - Updates a unit's status
  async updateUnitStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateRequest: UpdateUnitRequest = req.body;
      
      if (!id) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Unit ID is required'
        };
        res.status(400).json(response);
        return;
      }

      if (!updateRequest.status) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Status is required'
        };
        res.status(400).json(response);
        return;
      }

      // Validate status value
      if (!Object.values(UnitStatus).includes(updateRequest.status)) {
        const response: ApiResponse<never> = {
          success: false,
          error: `Invalid status. Valid values are: ${Object.values(UnitStatus).join(', ')}`
        };
        res.status(400).json(response);
        return;
      }

      const result = UnitService.updateUnitStatus(id, updateRequest);
      
      if (!result.success) {
        const response: ApiResponse<never> = {
          success: false,
          error: result.error
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse<Unit> = {
        success: true,
        data: result.unit,
        message: 'Unit status updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  }
}

export default new UnitController();
