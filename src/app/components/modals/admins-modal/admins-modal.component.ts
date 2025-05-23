import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminsService } from '../../../../services/admins.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-admins-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admins-modal.component.html',
  styleUrls: ['./admins-modal.component.css'],
})
export class AdminsModalComponent implements OnInit {
  @Input() type: 'add' | 'edit' | 'view' | null = null;
  @Input() admin: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  isLoading = false;

  private readonly _ToastService = inject(ToastService);

  constructor(private fb: FormBuilder, private adminsService: AdminsService) {}

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/
          ),
          ,
        ],
      ],
    });

    if (this.type === 'edit' && this.admin) {
      // Set values for edit
      this.form.patchValue({
        name: this.admin.name,
        email: this.admin.email,
      });
    }

    // Make password required only for "add" mode
    if (this.type === 'add') {
      this.form
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  // Submit form
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.form.value;

    if (this.type === 'add') {
      this.adminsService.addAdmin(formData).subscribe({
        next: () => {
          this._ToastService.show('success', 'Admin added successfully');
          this.handleSuccess();
        },
        error: (err) => {
          this.handleError(err);
          this._ToastService.show('error', err.error.message);
        },
      });
    } else if (this.type === 'edit' && this.admin?._id) {
      // If password is empty, remove it from request
      if (!formData.password) delete formData.password;

      this.adminsService.UpdateAdmins(this.admin?._id, formData).subscribe({
        next: () => {
          this._ToastService.show('success', 'Admin updated successfully');
          this.handleSuccess();
        },
        error: (err) => {
          this.handleError(err);
          this._ToastService.show('error', err.error.message);
        },
      });
    }
  }

  // Handle success
  handleSuccess() {
    this.saved.emit();
    this.isLoading = false;
  }

  handleError(err: any) {
    console.error('Operation failed', err);
    this.isLoading = false;
  }

  // Close modal
  onClose() {
    this.close.emit();
  }
}
