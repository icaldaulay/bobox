import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Unit, CreateUnitRequest, UpdateUnitRequest, UnitStatus } from '../types';
import UnitService from '../services/unitService';

// Query keys untuk caching
export const queryKeys = {
  units: ['units'] as const,
  unitsWithFilter: (status?: UnitStatus) => ['units', { status }] as const,
  unit: (id: string) => ['units', id] as const,
  health: ['health'] as const,
};

// Hook untuk fetch all units dengan optional filter
export const useUnits = (statusFilter?: UnitStatus) => {
  return useQuery({
    queryKey: queryKeys.unitsWithFilter(statusFilter),
    queryFn: () => UnitService.getAllUnits(statusFilter),
    staleTime: 30000, // Data dianggap fresh selama 30 detik
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook untuk fetch single unit by ID
export const useUnit = (id: string) => {
  return useQuery({
    queryKey: queryKeys.unit(id),
    queryFn: () => UnitService.getUnitById(id),
    enabled: !!id, // Only run query jika ID ada
    staleTime: 30000,
    retry: 2,
  });
};

// Hook untuk create new unit
export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (unitData: CreateUnitRequest) => UnitService.createUnit(unitData),
    onSuccess: () => {
      // Invalidate dan refetch units list setelah create berhasil
      queryClient.invalidateQueries({ queryKey: queryKeys.units });
    },
    onError: (error) => {
      console.error('Failed to create unit:', error);
    },
  });
};

// Hook untuk update unit status
export const useUpdateUnitStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateUnitRequest }) => 
      UnitService.updateUnitStatus(id, updateData),
    onSuccess: (updatedUnit) => {
      // Update specific unit di cache
      queryClient.setQueryData(
        queryKeys.unit(updatedUnit.id), 
        updatedUnit
      );
      
      // Invalidate units list untuk refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.units });
    },
    onError: (error) => {
      console.error('Failed to update unit status:', error);
    },
  });
};

// Hook untuk health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => UnitService.healthCheck(),
    refetchInterval: 60000, // Check setiap 1 menit
    staleTime: 30000,
    retry: 2,
  });
};

// Hook untuk optimistic updates (advanced)
export const useOptimisticUpdateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateUnitRequest }) => 
      UnitService.updateUnitStatus(id, updateData),
    
    // Optimistic update - update UI immediately
    onMutate: async ({ id, updateData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.unit(id) });
      
      // Snapshot previous value
      const previousUnit = queryClient.getQueryData<Unit>(queryKeys.unit(id));
      
      // Optimistically update cache
      if (previousUnit) {
        const optimisticUnit: Unit = {
          ...previousUnit,
          status: updateData.status,
          lastUpdated: new Date().toISOString(),
        };
        
        queryClient.setQueryData(queryKeys.unit(id), optimisticUnit);
      }
      
      return { previousUnit, id };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousUnit) {
        queryClient.setQueryData(
          queryKeys.unit(context.id), 
          context.previousUnit
        );
      }
    },
    
    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unit(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.units });
    },
  });
};
