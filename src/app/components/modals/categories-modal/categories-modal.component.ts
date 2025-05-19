import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../../../services/categories.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-categories-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.css'],
})
export class CategoriesModalComponent implements OnChanges {
  @Input() activeModal: 'getById' | 'update' | 'add' | null = null;
  @Input() categoryId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  categoryForm!: FormGroup;
  categoryData: any;
  loading = false;
  isClosing = false;

  private readonly _ToastService = inject(ToastService);

  constructor(private fb: FormBuilder, private service: CategoriesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeModal === 'update' && this.categoryId) {
      this.fetchCategoryData(this.categoryId, true);
    }

    if (this.activeModal === 'getById' && this.categoryId) {
      this.fetchCategoryData(this.categoryId, false);
    }

    if (this.activeModal === 'add') {
      this.initForm();
    }
  }

  // Initialize form for add or update
  initForm(forUpdate = false) {
    this.categoryForm = this.fb.group({
      categoryName: [
        '',

        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      categoryThumbnail: [
        '',
        [Validators.required, Validators.pattern(/^https:\/\/.+/)],
      ],
    });
  }

  // Fetch category data by ID for update or viewing
  fetchCategoryData(id: string, forEdit: boolean) {
    this.loading = true;
    this.service.getSpecificCategry(id).subscribe({
      next: (res: any) => {
        this.categoryData = res.data || res;

        if (forEdit) {
          this.initForm(true);
          this.categoryForm.patchValue({
            categoryName: this.categoryData.name,
            categoryThumbnail: this.categoryData.thumbnail,
          });
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load category', err);
        this.loading = false;
      },
    });
  }
  // Handle form submission for adding or updating a category
  submitForm() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const formValues = this.categoryForm.value;
    const payload = {
      name: formValues.categoryName,
      thumbnail: formValues.categoryThumbnail,
    };

    if (this.activeModal === 'add') {
      this.service.addCategory(payload).subscribe({
        next: () => {
          this._ToastService.show('success', 'category added successfully');
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => {
          console.error('Add failed', err);
          this._ToastService.show('error', 'failed to add category');
        },
      });
      console.log('Submitting payload:', payload);
    }

    if (this.activeModal === 'update' && this.categoryId) {
      this.service.updateCategory(this.categoryId, payload).subscribe({
        next: () => {
          this._ToastService.show('success', 'category updated successfully');
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => {
          console.error('Update failed', err);
          this._ToastService.show('error', 'failed to update category');
        },
      });
    }
  }

  closeModal() {
    this.isClosing = true;
    this.close.emit();
    this.categoryForm?.reset();
    this.categoryData = null;
    this.loading = false;
    this.isClosing = false;
  }
}
