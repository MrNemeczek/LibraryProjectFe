import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AuthService } from '../../../services/auth.service';
import { BookService } from '../../../services/book.service';
import { BookResponse } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Button,
    InputText,
    TableModule,
    Card,
    Tag,
    IconField,
    InputIcon,
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  private bookService = inject(BookService);
  protected authService = inject(AuthService);
  private router = inject(Router);

  books: BookResponse[] = [];
  filteredBooks: BookResponse[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 20;
  loading = false;
  searchTerm = '';

  get isLibrarianOrAdmin(): boolean {
    return this.authService.hasAnyRole(['Librarian', 'Administrator']);
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.books = response.items;
        this.totalCount = response.totalCount;
        this.applyFilter();
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
    this.loadBooks();
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBooks = this.books.filter((b) =>
        b.title.toLowerCase().includes(term)
      );
    }
  }

  onSearchInput(): void {
    this.applyFilter();
  }

  viewBook(id: number): void {
    this.router.navigate(['/books', id]);
  }

  editBook(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/books', id, 'edit']);
  }
}
