export interface LocationDto {
  id: number;
  name: string;
  description: string;
  categoryId?: number;
  imageUrl?: string;
}

export interface LocationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
}