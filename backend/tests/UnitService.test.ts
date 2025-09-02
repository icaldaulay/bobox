import UnitService from '../src/utils/UnitService';
import { UnitType, UnitStatus } from '../src/models/Unit';

describe('UnitService - Status Transition Rules', () => {
  beforeEach(() => {
    // Reset service state before each test
    (UnitService as any).units = [];
  });

  describe('Business Rule: Cannot change directly from Occupied to Available', () => {
    test('should reject direct transition from Occupied to Available', () => {
      // Create a unit with Occupied status
      const unit = UnitService.createUnit({
        name: 'Test-Unit-01',
        type: UnitType.CAPSULE
      });

      // Manually set status to Occupied
      UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });

      // Try to change directly to Available - should fail
      const result = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.AVAILABLE });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot change status directly from Occupied to Available');
    });

    test('should allow Occupied -> Cleaning In Progress -> Available', () => {
      // Create a unit
      const unit = UnitService.createUnit({
        name: 'Test-Unit-02',
        type: UnitType.CABIN
      });

      // Set to Occupied
      UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });

      // Change to Cleaning In Progress - should succeed
      const step1 = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.CLEANING_IN_PROGRESS });
      expect(step1.success).toBe(true);
      expect(step1.unit?.status).toBe(UnitStatus.CLEANING_IN_PROGRESS);

      // Change to Available - should succeed
      const step2 = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.AVAILABLE });
      expect(step2.success).toBe(true);
      expect(step2.unit?.status).toBe(UnitStatus.AVAILABLE);
    });

    test('should allow Occupied -> Maintenance Needed -> Available', () => {
      // Create a unit
      const unit = UnitService.createUnit({
        name: 'Test-Unit-03',
        type: UnitType.CAPSULE
      });

      // Set to Occupied
      UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });

      // Change to Maintenance Needed - should succeed
      const step1 = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.MAINTENANCE_NEEDED });
      expect(step1.success).toBe(true);
      expect(step1.unit?.status).toBe(UnitStatus.MAINTENANCE_NEEDED);

      // Change to Available - should succeed
      const step2 = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.AVAILABLE });
      expect(step2.success).toBe(true);
      expect(step2.unit?.status).toBe(UnitStatus.AVAILABLE);
    });
  });

  describe('Other status transitions', () => {
    test('should allow Available -> Occupied', () => {
      const unit = UnitService.createUnit({
        name: 'Test-Unit-04',
        type: UnitType.CABIN
      });

      const result = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.OCCUPIED });
      expect(result.success).toBe(true);
      expect(result.unit?.status).toBe(UnitStatus.OCCUPIED);
    });

    test('should allow Available -> Maintenance Needed', () => {
      const unit = UnitService.createUnit({
        name: 'Test-Unit-05',
        type: UnitType.CAPSULE
      });

      const result = UnitService.updateUnitStatus(unit.id, { status: UnitStatus.MAINTENANCE_NEEDED });
      expect(result.success).toBe(true);
      expect(result.unit?.status).toBe(UnitStatus.MAINTENANCE_NEEDED);
    });
  });

  describe('Error cases', () => {
    test('should return error for non-existent unit', () => {
      const result = UnitService.updateUnitStatus('non-existent-id', { status: UnitStatus.AVAILABLE });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unit not found');
    });
  });

  describe('Valid next statuses', () => {
    test('should return correct valid next statuses for Available', () => {
      const validStatuses = UnitService.getValidNextStatuses(UnitStatus.AVAILABLE);
      expect(validStatuses).toContain(UnitStatus.OCCUPIED);
      expect(validStatuses).toContain(UnitStatus.MAINTENANCE_NEEDED);
      expect(validStatuses).not.toContain(UnitStatus.CLEANING_IN_PROGRESS);
    });

    test('should return correct valid next statuses for Occupied', () => {
      const validStatuses = UnitService.getValidNextStatuses(UnitStatus.OCCUPIED);
      expect(validStatuses).toContain(UnitStatus.CLEANING_IN_PROGRESS);
      expect(validStatuses).toContain(UnitStatus.MAINTENANCE_NEEDED);
      expect(validStatuses).not.toContain(UnitStatus.AVAILABLE);
    });

    test('should return correct valid next statuses for Cleaning In Progress', () => {
      const validStatuses = UnitService.getValidNextStatuses(UnitStatus.CLEANING_IN_PROGRESS);
      expect(validStatuses).toContain(UnitStatus.AVAILABLE);
      expect(validStatuses).toContain(UnitStatus.MAINTENANCE_NEEDED);
      expect(validStatuses).not.toContain(UnitStatus.OCCUPIED);
    });

    test('should return correct valid next statuses for Maintenance Needed', () => {
      const validStatuses = UnitService.getValidNextStatuses(UnitStatus.MAINTENANCE_NEEDED);
      expect(validStatuses).toContain(UnitStatus.AVAILABLE);
      expect(validStatuses).not.toContain(UnitStatus.OCCUPIED);
      expect(validStatuses).not.toContain(UnitStatus.CLEANING_IN_PROGRESS);
    });
  });
});
