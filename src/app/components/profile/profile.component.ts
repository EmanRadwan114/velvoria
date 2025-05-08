import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  image: string = 'https://picsum.photos/350';

  isEditingPersonalInfo: boolean = false;
  isEditingPassword: boolean = false;

  isPersonalInfo: boolean = true;
  isOrder: boolean = false;

  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  originalEmail: string = '';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  passwordSuccessMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const tab: string = params['tab'];
      this.isOrder = tab === 'orders';
      this.isPersonalInfo = !this.isOrder;
    });

    this.usersService.getUserProfile().subscribe((user) => {
      console.log(user.name);
      this.originalEmail = user.email;

      this.personalInfoForm = this.fb.group({
        name: [user.name, [Validators.required, Validators.minLength(3)]],
        email: [
          user.email,
          [
            Validators.required,
            Validators.pattern(/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/),
          ],
        ],
        address: [
          user.address?.[user.address.length - 1] || '',
          [Validators.required],
        ],
        image: [user.image || '', [Validators.required]],
      });

      this.passwordForm = this.fb.group({
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      });
    });
  }

  showPersonalInfo(): void {
    this.isPersonalInfo = true;
    this.isOrder = false;
    this.router.navigate([], { queryParams: { tab: 'info' } });
  }

  showOrders(): void {
    this.isOrder = true;
    this.isPersonalInfo = false;
    this.router.navigate([], { queryParams: { tab: 'orders' } });
  }

  editCancelPersonalInfo(): void {
    this.isEditingPersonalInfo = !this.isEditingPersonalInfo;

    if (!this.isEditingPersonalInfo) {
      this.usersService.getUserProfile().subscribe((user) => {
        this.personalInfoForm.patchValue({
          name: user.name,
          email: user.email,
          address: user.address?.[user.address.length - 1] || '',
          image: user.image || '',
        });
        this.originalEmail = user.email;
      });
    }
  }

  editCancelPassword(): void {
    this.isEditingPassword = !this.isEditingPassword;

    if (!this.isEditingPassword) {
      this.passwordForm.reset();
    }
  }

  savePersonalInfo(): void {
    if (this.personalInfoForm.invalid) return;

    const { name, email, address } = this.personalInfoForm.value;
    this.usersService.updateUserProfile({ name, email, address }).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully.';
        this.errorMessage = null;
        this.isEditingPersonalInfo = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.successMessage = null;
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.usersService
      .updateUserProfile({ oldPassword: currentPassword, newPassword })
      .subscribe({
        next: () => {
          this.passwordSuccessMessage = 'Password updated successfully.';
          this.passwordErrorMessage = null;
          this.isEditingPassword = false;
          this.passwordForm.reset();
        },
        error: (err) => {
          this.passwordErrorMessage =
            err.error?.message || 'Failed to update password.';
          this.passwordSuccessMessage = null;
        },
      });
  }
}
