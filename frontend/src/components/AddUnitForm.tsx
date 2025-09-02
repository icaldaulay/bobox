import React, { useState } from 'react';
import { UnitType, CreateUnitRequest, FormErrors } from '../types';
import { useCreateUnit } from '../hooks/useUnits';
import { getTypeDisplayName } from '../utils/colorStyles';

interface AddUnitFormProps {
  onUnitCreated?: () => void;
  onCancel?: () => void;
}

const AddUnitForm: React.FC<AddUnitFormProps> = ({ onUnitCreated, onCancel }) => {
  const [formData, setFormData] = useState<CreateUnitRequest>({
    name: '',
    type: UnitType.CAPSULE
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createUnitMutation = useCreateUnit();

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Unit name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Unit name must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9\-_\s]+$/.test(formData.name)) {
      newErrors.name = 'Unit name can only contain letters, numbers, hyphens, underscores, and spaces';
    }

    if (!Object.values(UnitType).includes(formData.type)) {
      newErrors.type = 'Please select a valid unit type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createUnitMutation.mutateAsync({
        name: formData.name.trim(),
        type: formData.type
      });
      
      // Reset form
      setFormData({
        name: '',
        type: UnitType.CAPSULE
      });
      setErrors({});
      
      // Notify parent component
      onUnitCreated?.();
      
    } catch (error: any) {
      // Error sudah di-handle oleh mutation hook
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    // Clear error saat user mulai typing
    if (errors.name && value.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UnitType;
    setFormData(prev => ({ ...prev, type: value }));
    
    // Clear error
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: undefined }));
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      type: UnitType.CAPSULE
    });
    setErrors({});
  };

  const isLoading = isSubmitting || createUnitMutation.isPending;

  return (
    <div className="add-unit-form">
      <div className="form-header">
        <h2>Add New Unit</h2>
        <p className="form-description">
          Create a new capsule or cabin unit. The status will be set to "Available" by default.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="unit-form">
        <div className="form-group">
          <label htmlFor="unit-name" className="form-label">
            Unit Name *
          </label>
          <input
            id="unit-name"
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g., Capsule-A03, Forest-Cabin-3"
            className={`form-input ${errors.name ? 'error' : ''}`}
            disabled={isLoading}
            maxLength={50}
          />
          {errors.name && (
            <span className="error-text">{errors.name}</span>
          )}
          <span className="form-hint">
            Use a descriptive name like "Capsule-A03" or "Forest-Cabin-3"
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="unit-type" className="form-label">
            Unit Type *
          </label>
          <select
            id="unit-type"
            value={formData.type}
            onChange={handleTypeChange}
            className={`form-select ${errors.type ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value={UnitType.CAPSULE}>{getTypeDisplayName(UnitType.CAPSULE)}</option>
            <option value={UnitType.CABIN}>{getTypeDisplayName(UnitType.CABIN)}</option>
          </select>
          {errors.type && (
            <span className="error-text">{errors.type}</span>
          )}
        </div>

        {createUnitMutation.isError && (
          <div className="form-error">
            <strong>Error:</strong> {createUnitMutation.error?.message}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Creating...
              </>
            ) : (
              'Create Unit'
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="reset-btn"
          >
            Reset
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {createUnitMutation.isSuccess && (
        <div className="success-message">
          ✅ Unit created successfully!
        </div>
      )}
    </div>
  );
};

export default AddUnitForm;
