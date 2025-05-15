import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminsService } from '../../../../services/admins.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private adminsService: AdminsService) {}

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, ]],
      password: ['', [Validators.minLength(6), Validators.required ,
        Validators.pattern(/^(?!\d+$)[a-zA-Z0-9_]+$/),
      ]],
      image: [
        'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?uid=R194767243&ga=GA1.1.1957810835.1742649565&semt=ais_hybrid&w=740',
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
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  // Submit form
  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const formData = this.form.value;

    if (this.type === 'add') {
      this.adminsService.addAdmin(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    } else if (this.type === 'edit' && this.admin?._id) {
      // If password is empty, remove it from request
      console.log('🎇👉🟢Updating admin ID:', this.admin._id);
      if (!formData.password) delete formData.password;

      this.adminsService
        .UpdateAdmins(this.admin._id, {
          name: formData.name,
          oldPassword: formData.password,
          newPassword: formData.password,
          image:
            'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?uid=R194767243&ga=GA1.1.1957810835.1742649565&semt=ais_hybrid&w=740',
        })
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => this.handleError(err),
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
