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
import { ProductsService } from '../../../../services/products.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';

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

  productForm: FormGroup;
  productData: any = null;
  loading = false;
  lightboxOpen = false;
  lightboxIndex = 0;

  private lettersOnlyPattern = /^[a-zA-Z\s]*$/;
  private readonly _ToastService = inject(ToastService);

  constructor(private fb: FormBuilder, private service: ProductsService) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoryID: ['', Validators.required],
      thumbnail: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\//)],
      ],
      material: [
        '',
        [Validators.required, Validators.pattern(this.lettersOnlyPattern)],
      ],
      color: [
        '',
        [Validators.required, Validators.pattern(this.lettersOnlyPattern)],
      ],
      label: [[]],
      images: [[], [Validators.required]],
    });
  }

  get title() {
    return this.productForm.get('title');
  }
  get material() {
    return this.productForm.get('material');
  }
  get color() {
    return this.productForm.get('color');
  }
  get description() {
    return this.productForm.get('description');
  }
  get thumbnail() {
    return this.productForm.get('thumbnail');
  }
  get price() {
    return this.productForm.get('price');
  }
  get stock() {
    return this.productForm.get('stock');
  }
  get categoryID() {
    return this.productForm.get('categoryID');
  }
  get images() {
    return this.productForm.get('images');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeModal === 'add') {
      this.initForm();
    }

    if (this.activeModal === 'update' && this.productId) {
      this.fetchProduct(this.productId, true);
    }

    if (this.activeModal === 'getById' && this.productId) {
      this.fetchProduct(this.productId, false);
    }
  }

  private initForm(data: any = null) {
    this.productForm.patchValue({
      title: data?.title || '',
      description: data?.description || '',
      price: data?.price || null,
      stock: data?.stock || null,
      categoryID: data?.categoryID || '',
      thumbnail: data?.thumbnail || '',
      material: data?.material || '',
      color: data?.color || '',
      label: data?.label || [],
      images: data?.images || [],
    });
  }

  private fetchProduct(id: string, forEdit: boolean) {
    this.loading = true;
    this.service.getSpecificProduct(id).subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res.data) ? res.data[0] : res.data;
        const cat = this.categories.find((c) => c._id === raw.categoryID);
        raw.categoryName = cat?.name ?? '–';
        this.productData = raw;

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

  isSubmitting = false;

  submitForm() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.productForm.value,
      price: this.safeParseFloat(this.productForm.value.price),
      stock: this.safeParseInt(this.productForm.value.stock),
    };

    const isAddMode = this.activeModal === 'add';
    const observable = isAddMode
      ? this.service.addProduct(payload)
      : this.service.updateProduct(this.productId!, payload);

    observable.subscribe({
      next: () => {
        const message = isAddMode
          ? 'New Product Added Successfully'
          : 'Product Updated Successfully';
        this._ToastService.show('success', message);

        this.refresh.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error submitting form', err);
        this._ToastService.show(
          'error',
          err.error?.message || 'Server error occurred'
        );
      },
    });
  }

  private safeParseFloat(value: any): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  private safeParseInt(value: any): number {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  }

  closeModal() {
    this.close.emit();
    this.productForm.reset();
    this.productData = null;
    this.loading = false;
  }

  onLabelChange(event: any) {
    const control = this.productForm.get('label');
    const value = control?.value || [];
    const labelValue = event.target.value;

    if (event.target.checked) {
      control?.setValue([...value, labelValue]);
    } else {
      control?.setValue(value.filter((v: string) => v !== labelValue));
    }
    control?.markAsTouched();
  }

  addImage() {
    const images = this.productForm.get('images')?.value || [];
    this.productForm.get('images')?.setValue([...images, '']);
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

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  prevImage(event: MouseEvent) {
    event.stopPropagation();
    const images =
      this.activeModal === 'getById'
        ? this.productData?.images
        : this.productForm.get('images')?.value;

    if (images?.length) {
      this.lightboxIndex =
        this.lightboxIndex === 0 ? images.length : this.lightboxIndex - 1;
    }
  }

  nextImage(event: MouseEvent) {
    event.stopPropagation();
    const images =
      this.activeModal === 'getById'
        ? this.productData?.images
        : this.productForm.get('images')?.value;

    if (images?.length) {
      this.lightboxIndex =
        this.lightboxIndex === images.length ? 0 : this.lightboxIndex + 1;
    }
  }
}
