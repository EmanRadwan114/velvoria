import { Component, OnInit, inject } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    PaginationComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  image: string = '';
  totalPages = 1;
  currentPage = 1;
  isEditingPersonalInfo: boolean = false;
  isEditingPassword: boolean = false;

  isPersonalInfo: boolean = true;
  isOrder: boolean = false;

  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  originalEmail: string = '';
  role: string = '';

  userOrders: any[] = [];

  isLoading = false;

  private readonly _ToastService = inject(ToastService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getOrders(page: number) {
    this.usersService.getUserOrders(page).subscribe({
      next: (res) => {
        this.userOrders = [...res.data];
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Error fetching user orders!!!!', err);
      },
    });
  }

  getDateTimeOrder(date: string): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const tab: string = params['tab'];
      this.isOrder = tab === 'orders';
      this.isPersonalInfo = !this.isOrder;
    });
    this.getOrders(this.currentPage);
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.usersService.getUserProfile().subscribe((user) => {
      const { name, email, image, address, role } = user.data;

      this.originalEmail = email;
      this.role = role;
      this.image = image;

      const formConfig: any = {
        name: [name, [Validators.required, Validators.minLength(3)]],
        email: [email, [Validators.required, Validators.email]],
        image: [image || '', [Validators.required]],
      };

      if (role === 'user') {
        formConfig.address = [
          address?.[address.length - 1] || '',
          [Validators.required, Validators.minLength(5)],
        ];
      }

      this.personalInfoForm = this.fb.group(formConfig);
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
      this.isLoading = false;
    });
  }

  changePage(page: any) {
    this.currentPage = page;
    this.getOrders(this.currentPage);
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

  private updateProfileFields(): void {
    this.usersService.getUserProfile().subscribe((user) => {
      const { name, email, image, address } = user.data;

      this.personalInfoForm.patchValue({
        name,
        email,
        image: image || '',
        address: address?.[address.length - 1] || '',
      });
      localStorage.setItem('user', JSON.stringify(user.data));
    });
  }

  editCancelPersonalInfo(): void {
    this.isEditingPersonalInfo = !this.isEditingPersonalInfo;

    if (!this.isEditingPersonalInfo) {
      this.updateProfileFields();
    }
  }

  editCancelPassword(): void {
    this.isEditingPassword = !this.isEditingPassword;

    if (!this.isEditingPassword) {
      this.passwordForm.reset();
    }
  }

  savePersonalInfo(): void {
    this.isLoading = true;
    if (this.personalInfoForm.invalid) return;

    const { name, email, image, address } = this.personalInfoForm.value;
    const updatedData: any = { name, email, image };

    if (this.role === 'user') {
      updatedData.address = address;
    }

    this.usersService.updateUserProfile(updatedData).subscribe({
      next: (res) => {
        this._ToastService.show('success', 'Profile updated successfully');
        this.isEditingPersonalInfo = false;
        this.updateProfileFields();

        this.isLoading = false;
        if (this.originalEmail !== email) this.signOut();
        else {
          delete updatedData.email;
        }
      },
      error: (err) => {
        console.log(err);
        const msg: string =
          err?.error?.errors?.[0]?.message ??
          err?.error?.message ??
          'Failed to update profile';
        this._ToastService.show('error', msg);
        this.isEditingPersonalInfo = false;
        this.updateProfileFields();
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.usersService
      .updateUserProfile({ oldPassword: currentPassword, newPassword })
      .subscribe({
        next: (res) => {
          this._ToastService.show('success', 'Password updated successfully.');
          this.isEditingPassword = false;
          this.passwordForm.reset();

          // Fetch the updated profile and store it in localStorage
          this.usersService.getUserProfile().subscribe((user) => {
            localStorage.setItem('user', JSON.stringify(user.data));
          });
        },
        error: (err) => {
          console.log(err);
          const msg: string =
            err?.error?.errors?.[0]?.message ??
            err?.error?.message ??
            'Failed to update password.';
          this._ToastService.show('error', msg);
          this.isEditingPassword = false;
          this.passwordForm.reset();
        },
      });
  }

  signOut() {
    localStorage.removeItem('user');
    this.http
      .post(`${environment.backUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.authService.notifyLogout();
          this.router.navigate([`/login`]);
        },
      });
  }
}
