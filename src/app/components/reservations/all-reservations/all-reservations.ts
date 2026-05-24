import { Component, OnInit, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReservationService } from '../../../services/reservation.service';
import { ReservationResponse } from '../../../models/reservation.model';

@Component({
  selector: 'app-all-reservations',
  standalone: true,
  imports: [Button, TableModule, Tag, ToastModule],
  providers: [MessageService],
  templateUrl: './all-reservations.html',
  styleUrl: './all-reservations.scss',
})
export class AllReservations implements OnInit {
  private reservationService = inject(ReservationService);
  private messageService = inject(MessageService);

  reservations: ReservationResponse[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService
      .getAllReservations(this.page, this.pageSize)
      .subscribe({
        next: (response) => {
          this.reservations = response.items;
          this.totalCount = response.totalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadReservations();
  }

  getStatusSeverity(status: string): 'warn' | 'info' | 'success' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Active':
        return 'info';
      case 'Fulfilled':
        return 'success';
      case 'Cancelled':
        return 'warn';
      case 'Expired':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Active':
        return 'Aktywna';
      case 'Fulfilled':
        return 'Zrealizowana';
      case 'Cancelled':
        return 'Anulowana';
      case 'Expired':
        return 'Wygasła';
      default:
        return status;
    }
  }

  fulfillReservation(id: number): void {
    this.reservationService.fulfillReservation(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Zrealizowano',
          detail: 'Rezerwacja została zrealizowana. Utworzono wypożyczenie.',
        });
        this.loadReservations();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail:
            err.error?.message || 'Nie udało się zrealizować rezerwacji.',
        });
      },
    });
  }
}
