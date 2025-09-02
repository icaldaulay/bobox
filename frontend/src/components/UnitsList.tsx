import React, { useState, useMemo } from 'react';
import { Unit, FilterState, UnitType, UnitStatus } from '../types';
import { useUnits } from '../hooks/useUnits';
import UnitCard from './UnitCard';
import FilterControls from './FilterControls';
import AddUnitForm from './AddUnitForm';

const UnitsList: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all'
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch units data
  const { 
    data: units = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useUnits();

  // Filter units based on selected filters
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const typeMatch = filters.type === 'all' || unit.type === filters.type;
      const statusMatch = filters.status === 'all' || unit.status === filters.status;
      return typeMatch && statusMatch;
    });
  }, [units, filters]);

  // Group units by status for better organization
  const groupedUnits = useMemo(() => {
    const groups: { [key: string]: Unit[] } = {
      [UnitStatus.AVAILABLE]: [],
      [UnitStatus.OCCUPIED]: [],
      [UnitStatus.CLEANING_IN_PROGRESS]: [],
      [UnitStatus.MAINTENANCE_NEEDED]: []
    };

    filteredUnits.forEach(unit => {
      groups[unit.status].push(unit);
    });

    return groups;
  }, [filteredUnits]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Handle unit status updates
  const handleUnitStatusUpdate = (updatedUnit: Unit) => {
    // Force refresh untuk ensure data consistency
    setRefreshKey(prev => prev + 1);
  };

  // Handle successful unit creation
  const handleUnitCreated = () => {
    setShowAddForm(false);
    setRefreshKey(prev => prev + 1);
    refetch(); // Explicit refetch
  };

  // Refresh data
  const handleRefresh = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  // Get status display name
  const getStatusDisplayName = (status: UnitStatus): string => {
    switch (status) {
      case UnitStatus.AVAILABLE:
        return '🟢 Available';
      case UnitStatus.OCCUPIED:
        return '🔴 Occupied';
      case UnitStatus.CLEANING_IN_PROGRESS:
        return '🟡 Cleaning In Progress';
      case UnitStatus.MAINTENANCE_NEEDED:
        return '🟣 Maintenance Needed';
      default:
        return status;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading units...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Failed to Load Units</h2>
        <p className="error-message">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button onClick={handleRefresh} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="units-list-container">
      {/* Header */}
      <div className="units-header">
        <div className="header-content">
          <h1>🏨 Bobox Unit Management Dashboard</h1>
          <p className="header-description">
            Manage your capsule hotels and luxury cabins
          </p>
        </div>
        
        <div className="header-actions">
          <button
            onClick={handleRefresh}
            className="refresh-btn"
            disabled={isLoading}
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-unit-btn"
          >
            {showAddForm ? '✖️ Close Form' : '➕ Add New Unit'}
          </button>
        </div>
      </div>

      {/* Add Unit Form */}
      {showAddForm && (
        <div className="add-form-container">
          <AddUnitForm
            onUnitCreated={handleUnitCreated}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Filter Controls */}
      <FilterControls
        filters={filters}
        onFilterChange={handleFilterChange}
        totalUnits={units.length}
        filteredCount={filteredUnits.length}
      />

      {/* Units Display */}
      {filteredUnits.length === 0 ? (
        <div className="no-units-container">
          <div className="no-units-icon">🏨</div>
          <h3>No Units Found</h3>
          <p>
            {units.length === 0 
              ? 'No units have been created yet. Click "Add New Unit" to get started.'
              : 'No units match your current filters. Try adjusting the filter criteria.'
            }
          </p>
          {units.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="get-started-btn"
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="units-content">
          {/* Summary Stats */}
          <div className="units-summary">
            <h2>Units Overview</h2>
            <div className="summary-stats">
              {Object.entries(groupedUnits).map(([status, statusUnits]) => (
                <div key={status} className="stat-item">
                  <span className="stat-label">
                    {getStatusDisplayName(status as UnitStatus)}
                  </span>
                  <span className="stat-count">{statusUnits.length}</span>
                </div>
              ))}
              <div className="stat-item total">
                <span className="stat-label">🏨 Total Filtered</span>
                <span className="stat-count">{filteredUnits.length}</span>
              </div>
            </div>
          </div>

          {/* Units Grid */}
          <div className="units-grid">
            {Object.entries(groupedUnits).map(([status, statusUnits]) => {
              if (statusUnits.length === 0) return null;
              
              return (
                <div key={status} className="status-group">
                  <h3 className="status-group-title">
                    {getStatusDisplayName(status as UnitStatus)} ({statusUnits.length})
                  </h3>
                  <div className="status-units">
                    {statusUnits.map(unit => (
                      <UnitCard
                        key={`${unit.id}-${refreshKey}`}
                        unit={unit}
                        onStatusUpdate={handleUnitStatusUpdate}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitsList;
