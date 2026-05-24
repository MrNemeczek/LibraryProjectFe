import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookResponse, CreateBookRequest, UpdateBookRequest } from '../models/book.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, pageSize: number = 20): Observable<PaginatedResponse<BookResponse>> {
    const params = new HttpParams()
      .set('Page', page)
      .set('PageSize', pageSize);
    return this.http.get<PaginatedResponse<BookResponse>>('/api/books', { params });
  }

  getBook(id: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(`/api/books/${id}`);
  }

  createBook(request: CreateBookRequest): Observable<BookResponse> {
    return this.http.post<BookResponse>('/api/books', request);
  }

  updateBook(id: number, request: UpdateBookRequest): Observable<BookResponse> {
    return this.http.put<BookResponse>(`/api/books/${id}`, request);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${id}`);
  }
}
