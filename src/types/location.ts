export interface LocationDto {
  id: number;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  categoryName: string;
  imageUrl: string;
  categoryId: number;
}
export interface LocationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
}