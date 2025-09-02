import React, { useState } from 'react';
import { Unit, UnitStatus, UnitType } from '../types';
import { useUpdateUnitStatus } from '../hooks/useUnits';
import { getUnitTypeColor, getUnitStatusColor, getStatusDisplayName, getTypeDisplayName } from '../utils/colorStyles';

interface UnitCardProps {
  unit: Unit;
  onStatusUpdate?: (unit: Unit) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateUnitMutation = useUpdateUnitStatus();

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatus: UnitStatus): UnitStatus[] => {
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
  };

  // Handle status update
  const handleStatusChange = async (newStatus: UnitStatus) => {
    if (newStatus === unit.status) return;

    setIsUpdating(true);
    try {
      const updatedUnit = await updateUnitMutation.mutateAsync({
        id: unit.id,
        updateData: { status: newStatus }
      });
      
      onStatusUpdate?.(updatedUnit);
    } catch (error: any) {
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Format timestamp
  const formatLastUpdated = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const validStatuses = getValidNextStatuses(unit.status);

  return (
    <div className="unit-card">
      <div className="unit-card-header">
        <div className="unit-info">
          <h3 className="unit-name">{unit.name}</h3>
          <span 
            className="unit-type"
            style={{ backgroundColor: getUnitTypeColor(unit.type) }}
          >
            {getTypeDisplayName(unit.type)}
          </span>
        </div>
        <div 
          className="unit-status"
          style={{ backgroundColor: getUnitStatusColor(unit.status) }}
        >
          {getStatusDisplayName(unit.status)}
        </div>
      </div>

      <div className="unit-details">
        <p className="unit-id">ID: {unit.id}</p>
        <p className="last-updated">
          Last Updated: {formatLastUpdated(unit.lastUpdated)}
        </p>
      </div>

      <div className="unit-actions">
        <label htmlFor={`status-select-${unit.id}`} className="status-label">
          Update Status:
        </label>
        <select
          id={`status-select-${unit.id}`}
          value={unit.status}
          onChange={(e) => handleStatusChange(e.target.value as UnitStatus)}
          disabled={isUpdating || updateUnitMutation.isPending}
          className="status-select"
        >
          <option value={unit.status}>{getStatusDisplayName(unit.status)} (Current)</option>
          {validStatuses.map(status => (
            <option key={status} value={status}>
              {getStatusDisplayName(status)}
            </option>
          ))}
        </select>
        
        {(isUpdating || updateUnitMutation.isPending) && (
          <span className="loading-spinner">⏳</span>
        )}
      </div>

      {updateUnitMutation.isError && (
        <div className="error-message">
          Error: {updateUnitMutation.error?.message}
        </div>
      )}
    </div>
  );
};

export default UnitCard;
