import { UnitType, UnitStatus } from '../types';

// Unit Type Colors
export const getUnitTypeColor = (type: UnitType): string => {
  switch (type) {
    case UnitType.CAPSULE:
      return '#3b82f6'; // Blue
    case UnitType.CABIN:
      return '#10b981'; // Green
    default:
      return '#6b7280'; // Gray
  }
};

// Unit Status Colors
export const getUnitStatusColor = (status: UnitStatus): string => {
  switch (status) {
    case UnitStatus.AVAILABLE:
      return '#10b981'; // Green - Available
    case UnitStatus.OCCUPIED:
      return '#ef4444'; // Red - Occupied
    case UnitStatus.CLEANING_IN_PROGRESS:
      return '#f59e0b'; // Yellow - Cleaning
    case UnitStatus.MAINTENANCE_NEEDED:
      return '#6b7280'; // Gray - Maintenance
    default:
      return '#6b7280'; // Gray - Default
  }
};

// Unit Status Display Names (English)
export const getStatusDisplayName = (status: UnitStatus): string => {
  const statusNames: Record<UnitStatus, string> = {
    [UnitStatus.AVAILABLE]: 'Available',
    [UnitStatus.OCCUPIED]: 'Occupied',
    [UnitStatus.CLEANING_IN_PROGRESS]: 'Cleaning In Progress',
    [UnitStatus.MAINTENANCE_NEEDED]: 'Maintenance Needed'
  };
  return statusNames[status] || status;
};

// Unit Type Display Names (English)
export const getTypeDisplayName = (type: UnitType): string => {
  const typeNames: Record<UnitType, string> = {
    [UnitType.CAPSULE]: 'Capsule',
    [UnitType.CABIN]: 'Cabin'
  };
  return typeNames[type] || type;
};

// Apply styles to elements
export const applyUnitTypeStyle = (type: UnitType) => ({
  backgroundColor: getUnitTypeColor(type),
  color: 'white'
});

export const applyUnitStatusStyle = (status: UnitStatus) => ({
  backgroundColor: getUnitStatusColor(status),
  color: 'white'
});
