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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    PaginationComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  image: string = 'https://picsum.photos/350';
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

  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  userOrders: any[] = [];
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
        console.log(' 🟢User orders:', this.userOrders, this.totalPages);
      },
      error: (err) => {
        console.error('Error fetching user orders!!!!', err);
      },
    });
  }

  getDateTimeOrder(date: string): string {
    const dateTime = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return dateTime.toLocaleString('en-US', options);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const tab: string = params['tab'];
      this.isOrder = tab === 'orders';
      this.isPersonalInfo = !this.isOrder;
    });
    this.getOrders(this.currentPage);
    this.usersService.getUserProfile().subscribe((user) => {
      this.originalEmail = user.data.email;
      this.role = user.data.role;
      this.image = user.data.image;

      const formConfig: any = {
        name: [user.data.name, [Validators.required, Validators.minLength(3)]],
        email: [
          user.data.email,
          [
            Validators.required,
            Validators.pattern(/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/),
          ],
        ],
        image: [user.data.image || '', [Validators.required]],
      };

      if (user.data.role === 'user') {
        formConfig.address = [
          user.data.address?.[user.data.address.length - 1] || '',
          [Validators.required],
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

  editCancelPersonalInfo(): void {
    this.isEditingPersonalInfo = !this.isEditingPersonalInfo;

    if (!this.isEditingPersonalInfo) {
      this.usersService.getUserProfile().subscribe((user) => {
        this.personalInfoForm.patchValue({
          name: user.data.name,
          email: user.data.email,
          address: user.data.address?.[user.address.length - 1] || '',
          image: user.data.image || '',
        });
        this.originalEmail = user.data.email;
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

    const { name, email, image, address } = this.personalInfoForm.value;
    const updatedData: any = { name, email, image };

    if (this.role === 'user') {
      updatedData.address = address;
    }

    this.usersService.updateUserProfile(updatedData).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastService.show('success', 'Profile updated successfully');
        this.isEditingPersonalInfo = false;

        // Fetch the updated profile and store it in localStorage
        this.usersService.getUserProfile().subscribe((user) => {
          localStorage.setItem('user', JSON.stringify(user.data));
        });

        this.authService.notifyLogin();
      },
      error: (err) => {
        console.log(err);
        const msg =
          err.error?.errors[0]?.message || 'Failed to update profile.';
        this.emailErrorMessage = msg;
        this._ToastService.show('error', msg);
        this.isEditingPersonalInfo = false;
        this.emailErrorMessage = null;
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
          console.log(res);
          this._ToastService.show('success', 'Password updated successfully.');
          this.isEditingPassword = false;
          this.passwordForm.reset();

          // Fetch the updated profile and store it in localStorage
          this.usersService.getUserProfile().subscribe((user) => {
            localStorage.setItem('user', JSON.stringify(user.data));
          });

          this.authService.notifyLogin();
        },
        error: (err) => {
          console.log(err);
          const msg =
            err.error?.errors[0]?.message || 'Failed to update password.';
          this.passwordErrorMessage = msg;
          this._ToastService.show('error', msg);
          this.isEditingPassword = false;
          this.passwordErrorMessage = null;
        },
      });
  }

  signOut() {
    this.http
      .post(`${environment.backUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          localStorage.removeItem('user');
          this.authService.notifyLogout();
          this.router.navigate(['/login/user']);
        },
      });
  }
}
