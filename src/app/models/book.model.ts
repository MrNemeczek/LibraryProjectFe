export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  categoryId: number;
  categoryName: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string | null;
  categoryName: string;
}

export interface UpdateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string | null;
  categoryName: string;
}
