import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BookList } from './book-list';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { BookResponse } from '../../../models/book.model';
import { PaginatedResponse } from '../../../models/common.model';

const mockBooks: BookResponse[] = [
  {
    id: 1,
    title: 'W pustyni i w puszczy',
    author: 'Henryk Sienkiewicz',
    isbn: '978-83-01-00001-1',
    description: '',
    categoryId: 1,
    categoryName: 'Przygodowa',
    copies: [],
  },
  {
    id: 2,
    title: 'Lalka',
    author: 'Bolesław Prus',
    isbn: '978-83-01-00002-2',
    description: '',
    categoryId: 2,
    categoryName: 'Powieść',
    copies: [],
  },
  {
    id: 3,
    title: 'Pan Tadeusz',
    author: 'Adam Mickiewicz',
    isbn: '978-83-01-00003-3',
    description: '',
    categoryId: 3,
    categoryName: 'Poezja',
    copies: [],
  },
];

const mockPaginated: PaginatedResponse<BookResponse> = {
  items: mockBooks,
  page: 1,
  pageSize: 20,
  totalCount: 3,
  totalPages: 1,
};

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;
  let bookService: { getBooks: ReturnType<typeof vi.fn> };
  let authService: { hasAnyRole: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    bookService = { getBooks: vi.fn() };
    authService = { hasAnyRole: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      component.books = mockBooks;
    });

    it('should show all books when searchTerm is empty', () => {
      component.searchTerm = '';
      component.applyFilter();
      expect(component.filteredBooks.length).toBe(3);
    });

    it('should filter books by title (case-insensitive)', () => {
      component.searchTerm = 'lalka';
      component.applyFilter();
      expect(component.filteredBooks.length).toBe(1);
      expect(component.filteredBooks[0].title).toBe('Lalka');
    });

    it('should return empty when no match', () => {
      component.searchTerm = 'nieistnieje';
      component.applyFilter();
      expect(component.filteredBooks.length).toBe(0);
    });

    it('should match partial title', () => {
      component.searchTerm = 'puszczy';
      component.applyFilter();
      expect(component.filteredBooks.length).toBe(1);
    });
  });

  describe('onPageChange', () => {
    it('should update page and pageSize and reload', () => {
      vi.spyOn(component, 'loadBooks').mockImplementation(() => {});

      component.onPageChange({ first: 20, rows: 10 });

      expect(component.page).toBe(3);
      expect(component.pageSize).toBe(10);
      expect(component.loadBooks).toHaveBeenCalled();
    });

    it('should compute page 1 correctly', () => {
      vi.spyOn(component, 'loadBooks').mockImplementation(() => {});

      component.onPageChange({ first: 0, rows: 20 });

      expect(component.page).toBe(1);
    });
  });

  describe('viewBook', () => {
    it('should navigate to book detail', () => {
      component.viewBook(5);
      expect(router.navigate).toHaveBeenCalledWith(['/books', 5]);
    });
  });

  describe('editBook', () => {
    it('should navigate to book edit with stopPropagation', () => {
      const event = { stopPropagation: vi.fn() } as unknown as Event;
      component.editBook(event, 3);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/books', 3, 'edit']);
    });
  });

  describe('isLibrarianOrAdmin', () => {
    it('should delegate to authService', () => {
      authService.hasAnyRole.mockReturnValue(true);
      expect(component.isLibrarianOrAdmin).toBe(true);
      expect(authService.hasAnyRole).toHaveBeenCalledWith([
        'Librarian',
        'Administrator',
      ]);
    });
  });
});
