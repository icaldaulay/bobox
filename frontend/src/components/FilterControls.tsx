import React from 'react';
import { UnitType, UnitStatus, FilterState } from '../types';
import { getStatusDisplayName, getTypeDisplayName } from '../utils/colorStyles';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalUnits: number;
  filteredCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  totalUnits,
  filteredCount
}) => {
  
  const handleTypeChange = (type: UnitType | 'all') => {
    onFilterChange({
      ...filters,
      type
    });
  };

  const handleStatusChange = (status: UnitStatus | 'all') => {
    onFilterChange({
      ...filters,
      status
    });
  };

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      status: 'all'
    });
  };

  const hasActiveFilters = filters.type !== 'all' || filters.status !== 'all';

  return (
    <div className="filter-controls">
      <div className="filter-header">
        <h2>Filter Units</h2>
        <div className="filter-stats">
          Showing {filteredCount} of {totalUnits} units
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="type-filter" className="filter-label">
            Filter by Type:
          </label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={(e) => handleTypeChange(e.target.value as UnitType | 'all')}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value={UnitType.CAPSULE}>{getTypeDisplayName(UnitType.CAPSULE)}</option>
            <option value={UnitType.CABIN}>{getTypeDisplayName(UnitType.CABIN)}</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value as UnitStatus | 'all')}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value={UnitStatus.AVAILABLE}>{getStatusDisplayName(UnitStatus.AVAILABLE)}</option>
            <option value={UnitStatus.OCCUPIED}>{getStatusDisplayName(UnitStatus.OCCUPIED)}</option>
            <option value={UnitStatus.CLEANING_IN_PROGRESS}>{getStatusDisplayName(UnitStatus.CLEANING_IN_PROGRESS)}</option>
            <option value={UnitStatus.MAINTENANCE_NEEDED}>{getStatusDisplayName(UnitStatus.MAINTENANCE_NEEDED)}</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="filter-group">
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
              type="button"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.type !== 'all' && (
            <span className="filter-tag">
              Type: {getTypeDisplayName(filters.type as UnitType)}
              <button
                onClick={() => handleTypeChange('all')}
                className="remove-filter-btn"
                type="button"
              >
                ×
              </button>
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="filter-tag">
              Status: {getStatusDisplayName(filters.status as UnitStatus)}
              <button
                onClick={() => handleStatusChange('all')}
                className="remove-filter-btn"
                type="button"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;
