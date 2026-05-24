export interface LoanResponse {
  id: number;
  userId: number;
  bookCopyId: number;
  reservationId?: number | null;
  loanDate: string;
  returnDate?: string | null;
  status: string;
}
