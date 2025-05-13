import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductsService } from '../../../../services/products.service';

@Component({
  selector: 'app-products-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-modal.component.html',
  styleUrls: ['./products-modal.component.css'],
})
export class ProductsModalComponent implements OnChanges {
  @Input() activeModal: 'getById' | 'update' | 'add' | null = null;
  @Input() productId: string | null = null;
  @Input() categories: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  productForm!: FormGroup;
  productData: any = null;
  loading = false;

  constructor(private fb: FormBuilder, private service: ProductsService) {
    this.productForm = this.fb.group({}); // temporary empty form
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.activeModal === 'add') {
  //     this.initForm(); // new product
  //   }

  //   if (this.activeModal === 'update' && this.productId) {
  //     this.fetchProduct(this.productId, true); // edit
  //   }

  //   if (this.activeModal === 'getById' && this.productId) {
  //     this.fetchProduct(this.productId, false); // read-only
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes); // Check the changes object
    if (this.activeModal === 'add') {
      this.initForm(); // Initialize form for new product
    }

    if (this.activeModal === 'update' && this.productId) {
      console.log('Fetching product data for ID:', this.productId); // Verify productId
      this.fetchProduct(this.productId, true); // Initialize form with fetched data for editing
    }

    if (this.activeModal === 'getById' && this.productId) {
      this.fetchProduct(this.productId, false); // Initialize form with fetched data for viewing
    }
  }

  private initForm(data: any = null) {
    console.log('Initializing form with data:', data);
    this.productForm = this.fb.group({
      title: [
        data?.title || '',
        [Validators.required, Validators.minLength(3)],
      ],
      description: [
        data?.description || '',
        [Validators.required, Validators.minLength(10)],
      ],
      price: [data?.price || null, [Validators.required, Validators.min(0.01)]],
      stock: [data?.stock || null, [Validators.required, Validators.min(0)]],
      categoryID: [data?.categoryID || '', Validators.required],
      thumbnail: [
        data?.thumbnail || '',
        [Validators.required, Validators.pattern(/^https?:\/\//)],
      ],
      material: [data?.material || '', Validators.required],
      color: [data?.color || '', Validators.required],
      label: [
        data?.label || [],
        [Validators.required, Validators.minLength(1)],
      ],
      images: [data?.images || [], [Validators.required]],
    });
    console.log('Form initialized:', this.productForm.value);
  }

  private fetchProduct(id: string, forEdit: boolean) {
    this.loading = true;
    this.service.getSpecificProduct(id).subscribe({
      next: (res: any) => {
        // pick the product object out of the envelope
        const raw = Array.isArray(res.data) ? res.data[0] : res.data;
        // map categoryID → categoryName
        const cat = this.categories.find((c) => c._id === raw.categoryID);
        raw.categoryName = cat?.name ?? '–';
        this.productData = raw;

        // initialize the form only if we're editing
        if (forEdit) {
          this.initForm(raw);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching product', err);
        this.loading = false;
      },
    });
  }

  submitForm() {
    if (this.productForm.invalid) return;

    const data = this.productForm.value;
    const payload = this.productForm.value;
    console.log('Submitting payload:', payload); // Check this in console
    console.log('Submitting payload:', this.productForm.value);

    if (this.activeModal === 'add') {
      this.service.addProduct(data).subscribe(() => {
        this.refresh.emit();
        this.closeModal();
      });
    } else if (this.activeModal === 'update' && this.productId) {
      this.service.updateProduct(this.productId, data).subscribe(() => {
        this.refresh.emit();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.close.emit();
    this.productForm?.reset();
    this.productData = null;
    this.loading = false;
  }

  onLabelChange(event: any) {
    const control = this.productForm.get('label');
    const value = control?.value || [];

    if (event.target.checked) {
      control?.setValue([...value, event.target.value]);
    } else {
      control?.setValue(value.filter((v: string) => v !== event.target.value));
    }

    control?.markAsTouched();
  }

  addImage() {
    const images = this.productForm.get('images')?.value || [];
    images.push('');
    this.productForm.get('images')?.setValue(images);
    this.productForm.get('images')?.markAsTouched();
  }

  removeImage(index: number) {
    const images = this.productForm.get('images')?.value || [];
    images.splice(index, 1);
    this.productForm.get('images')?.setValue(images);
    this.productForm.get('images')?.markAsTouched();
  }

  onImageChange(event: any, index: number) {
    const images = this.productForm.get('images')?.value || [];
    images[index] = event.target.value;
    this.productForm.get('images')?.setValue(images);
    this.productForm.get('images')?.markAsTouched();
  }
  lightboxOpen = false;
  lightboxIndex = 0;

  openLightbox(i: number) {
    this.lightboxIndex = i;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }
}
