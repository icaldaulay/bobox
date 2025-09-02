import axios from 'axios';
import { Unit, CreateUnitRequest, UpdateUnitRequest, ApiResponse, UnitStatus } from '../types';

// Base URL untuk API backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Axios instance dengan default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// API service class
export class UnitService {
  
  // GET /api/units - Fetch all units dengan optional status filter
  static async getAllUnits(statusFilter?: UnitStatus): Promise<Unit[]> {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await apiClient.get<ApiResponse<Unit[]>>('/units', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch units');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching units:', error);
      throw this.handleError(error);
    }
  }

  // GET /api/units/:id - Fetch single unit by ID
  static async getUnitById(id: string): Promise<Unit> {
    try {
      const response = await apiClient.get<ApiResponse<Unit>>(`/units/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch unit');
      }
      
      if (!response.data.data) {
        throw new Error('Unit not found');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unit:', error);
      throw this.handleError(error);
    }
  }

  // POST /api/units - Create new unit
  static async createUnit(unitData: CreateUnitRequest): Promise<Unit> {
    try {
      const response = await apiClient.post<ApiResponse<Unit>>('/units', unitData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create unit');
      }
      
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw this.handleError(error);
    }
  }

  // PUT /api/units/:id - Update unit status
  static async updateUnitStatus(id: string, updateData: UpdateUnitRequest): Promise<Unit> {
    try {
      const response = await apiClient.put<ApiResponse<Unit>>(`/units/${id}`, updateData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update unit');
      }
      
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating unit:', error);
      throw this.handleError(error);
    }
  }

  // Health check endpoint
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Error handler untuk consistent error formatting
  private static handleError(error: any): Error {
    if (error.response) {
      // HTTP error responses
      if (error.response?.data?.error) {
        return new Error(error.response.data.error);
      }
      
      if (error.response?.status === 404) {
        return new Error('Resource not found');
      }
      
      if (error.response?.status === 400) {
        return new Error(error.response?.data?.error || 'Invalid request');
      }
      
      if (error.response?.status >= 500) {
        return new Error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Network errors
      return new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    
    // Other errors
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

export default UnitService;
