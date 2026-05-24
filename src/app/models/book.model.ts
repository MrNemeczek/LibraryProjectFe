export interface BookCopyResponse {
  id: number;
  inventoryNumber: string;
  status: string;
}

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  categoryId: number;
  categoryName: string;
  copies: BookCopyResponse[];
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string | null;
  categoryName: string;
  inventoryNumbers?: string[] | null;
}

export interface UpdateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string | null;
  categoryName: string;
  inventoryNumbers?: string[] | null;
}
