import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanResponse } from '../models/loan.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private http: HttpClient) {}

  getMyLoans(
    page: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedResponse<LoanResponse>> {
    const params = new HttpParams()
      .set('Page', page)
      .set('PageSize', pageSize);
    return this.http.get<PaginatedResponse<LoanResponse>>('/api/loans', {
      params,
    });
  }

  getAllLoans(
    page: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedResponse<LoanResponse>> {
    const params = new HttpParams()
      .set('Page', page)
      .set('PageSize', pageSize);
    return this.http.get<PaginatedResponse<LoanResponse>>('/api/loans/all', {
      params,
    });
  }

  getLoan(id: number): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`/api/loans/${id}`);
  }

  returnBook(id: number): Observable<void> {
    return this.http.put<void>(`/api/loans/${id}/return`, {});
  }
}
