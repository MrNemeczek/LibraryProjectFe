import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    InputText,
    Textarea,
    Card,
    Message,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  bookId = 0;
  loading = false;
  submitting = false;
  error = '';

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    author: ['', [Validators.required, Validators.maxLength(200)]],
    isbn: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', Validators.maxLength(2000)],
    categoryName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get title() { return this.form.controls.title; }
  get author() { return this.form.controls.author; }
  get isbn() { return this.form.controls.isbn; }
  get description() { return this.form.controls.description; }
  get categoryName() { return this.form.controls.categoryName; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.bookId = Number(idParam);
      if (!isNaN(this.bookId)) {
        this.loadBook();
      }
    }
  }

  private loadBook(): void {
    this.loading = true;
    this.bookService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.form.patchValue({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          description: book.description,
          categoryName: book.categoryName,
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Nie znaleziono książki.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.error = '';

    const request = this.form.getRawValue();

    const action = this.isEdit
      ? this.bookService.updateBook(this.bookId, request)
      : this.bookService.createBook(request);

    action.subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.error =
          err.error?.message ||
          'Operacja nie powiodła się. Spróbuj ponownie.';
        this.submitting = false;
      },
    });
  }
}
