export interface ReservationResponse {
  id: number;
  userId: number;
  bookId: number;
  bookTitle: string;
  reservationDate: string;
  pickupDeadline?: string | null;
  status: string;
}

export interface CreateReservationRequest {
  bookId: number;
  pickupDeadlineDays?: number | null;
}
