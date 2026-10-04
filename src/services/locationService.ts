import api from '../api/axiosInstance';
import type { LocationDto, LocationParams } from '../types/location';

export const getLocations = async (params?: LocationParams): Promise<LocationDto[]> => {
  const response = await api.get<LocationDto[]>('/locations', {
    params: {
      pageSize: 100,
      ...params,
    },
  });
  return response.data;
};
export const getLocationById = async (id: number): Promise<LocationDto> => {
  const response = await api.get<LocationDto>(`/locations/${id}`);
  return response.data;
};