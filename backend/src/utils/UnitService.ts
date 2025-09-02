import { v4 as uuidv4 } from 'uuid';
import { Unit, UnitType, UnitStatus, CreateUnitRequest, UpdateUnitRequest } from '../models/Unit';

class UnitService {
  private units: Unit[] = [];

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleUnits: Omit<Unit, 'id' | 'lastUpdated'>[] = [
      { name: 'Capsule-A01', type: UnitType.CAPSULE, status: UnitStatus.AVAILABLE },
      { name: 'Capsule-A02', type: UnitType.CAPSULE, status: UnitStatus.OCCUPIED },
      { name: 'Forest-Cabin-1', type: UnitType.CABIN, status: UnitStatus.AVAILABLE },
      { name: 'Forest-Cabin-2', type: UnitType.CABIN, status: UnitStatus.CLEANING_IN_PROGRESS },
      { name: 'Capsule-B01', type: UnitType.CAPSULE, status: UnitStatus.MAINTENANCE_NEEDED }
    ];

    sampleUnits.forEach(unit => {
      this.units.push({
        ...unit,
        id: uuidv4(),
        lastUpdated: new Date().toISOString()
      });
    });
  }

  getAllUnits(statusFilter?: UnitStatus): Unit[] {
    if (statusFilter) {
      return this.units.filter(unit => unit.status === statusFilter);
    }
    return [...this.units];
  }

  getUnitById(id: string): Unit | undefined {
    return this.units.find(unit => unit.id === id);
  }

  createUnit(createRequest: CreateUnitRequest): Unit {
    const newUnit: Unit = {
      id: uuidv4(),
      name: createRequest.name,
      type: createRequest.type,
      status: UnitStatus.AVAILABLE, // Default status
      lastUpdated: new Date().toISOString()
    };

    this.units.push(newUnit);
    return newUnit;
  }

  updateUnitStatus(id: string, updateRequest: UpdateUnitRequest): { success: boolean; unit?: Unit; error?: string } {
    const unitIndex = this.units.findIndex(unit => unit.id === id);
    
    if (unitIndex === -1) {
      return { success: false, error: 'Unit not found' };
    }

    const currentUnit = this.units[unitIndex];
    const newStatus = updateRequest.status;

    // Business Rule: Cannot change directly from Occupied to Available
    if (currentUnit.status === UnitStatus.OCCUPIED && newStatus === UnitStatus.AVAILABLE) {
      return { 
        success: false, 
        error: 'Cannot change status directly from Occupied to Available. Unit must first be set to Cleaning In Progress or Maintenance Needed.' 
      };
    }

    // Update the unit
    const updatedUnit: Unit = {
      ...currentUnit,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    };

    this.units[unitIndex] = updatedUnit;
    return { success: true, unit: updatedUnit };
  }

  // Utility method to check if status transition is valid
  private isValidStatusTransition(currentStatus: UnitStatus, newStatus: UnitStatus): boolean {
    // Rule: Cannot go directly from Occupied to Available
    if (currentStatus === UnitStatus.OCCUPIED && newStatus === UnitStatus.AVAILABLE) {
      return false;
    }
    return true;
  }

  // Method to get all valid next statuses for a given current status
  getValidNextStatuses(currentStatus: UnitStatus): UnitStatus[] {
    switch (currentStatus) {
      case UnitStatus.AVAILABLE:
        return [UnitStatus.OCCUPIED, UnitStatus.MAINTENANCE_NEEDED];
      case UnitStatus.OCCUPIED:
        return [UnitStatus.CLEANING_IN_PROGRESS, UnitStatus.MAINTENANCE_NEEDED];
      case UnitStatus.CLEANING_IN_PROGRESS:
        return [UnitStatus.AVAILABLE, UnitStatus.MAINTENANCE_NEEDED];
      case UnitStatus.MAINTENANCE_NEEDED:
        return [UnitStatus.AVAILABLE];
      default:
        return [];
    }
  }
}

export default new UnitService();
