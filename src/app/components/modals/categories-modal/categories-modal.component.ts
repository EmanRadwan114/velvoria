import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoriesService } from '../../../../services/categories.service';

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
          this.initForm(true); // reinitialize form with validators
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
    const formValues = this.categoryForm.value;
    const payload = {
      name: formValues.categoryName,
      thumbnail: formValues.categoryThumbnail,
    };

    if (this.activeModal === 'add') {
      this.service.addCategory(payload).subscribe({
        next: () => {
          this.refresh.emit(); // Refresh parent component
          this.closeModal();
        },
        error: (err) => {
          console.error('Add failed', err);
          alert(err.error?.message || 'Something went wrong');
        },
      });
      console.log('Submitting payload:', payload);
    }

    if (this.activeModal === 'update' && this.categoryId) {
      this.service.updateCategory(this.categoryId, payload).subscribe({
        next: () => {
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err),
      });
    }
  }

  // Close the modal and reset the form
  closeModal() {
    this.isClosing = true;
    this.close.emit(); // Emit close event to parent
    this.categoryForm?.reset(); // Reset form
    this.categoryData = null;
    this.loading = false;
    this.isClosing = false;
  }
}
