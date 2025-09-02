export enum UnitType {
  CAPSULE = 'capsule',
  CABIN = 'cabin'
}

export enum UnitStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  CLEANING_IN_PROGRESS = 'Cleaning In Progress',
  MAINTENANCE_NEEDED = 'Maintenance Needed'
}

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  lastUpdated: string;
}

export interface CreateUnitRequest {
  name: string;
  type: UnitType;
}

export interface UpdateUnitRequest {
  status: UnitStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
