import { Component, OnInit, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoanService } from '../../../services/loan.service';
import { LoanResponse } from '../../../models/loan.model';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [Button, TableModule, Tag, ToastModule, ConfirmDialog],
  providers: [MessageService, ConfirmationService],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.scss',
})
export class MyLoans implements OnInit {
  private loanService = inject(LoanService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  loans: LoanResponse[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getMyLoans(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.loans = response.items;
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
    this.loadLoans();
  }

  getStatusSeverity(status: string): 'warn' | 'info' | 'success' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Active':
        return 'info';
      case 'Returned':
        return 'success';
      case 'Overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Active':
        return 'Aktywne';
      case 'Returned':
        return 'Zwrócone';
      case 'Overdue':
        return 'Po terminie';
      default:
        return status;
    }
  }

  confirmReturn(id: number): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz zwrócić tę książkę?',
      header: 'Zwrot książki',
      icon: 'pi pi-refresh',
      acceptLabel: 'Tak, zwróć',
      rejectLabel: 'Anuluj',
      accept: () => this.returnBook(id),
    });
  }

  private returnBook(id: number): void {
    this.loanService.returnBook(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Zwrócono',
          detail: 'Książka została zwrócona pomyślnie.',
        });
        this.loadLoans();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: err.error?.message || 'Nie udało się zwrócić książki.',
        });
      },
    });
  }
}
