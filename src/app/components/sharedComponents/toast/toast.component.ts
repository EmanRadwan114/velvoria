import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule,CommonModule, AsyncPipe, NgFor, NgClass],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() showToast: boolean | null = null;

  toasts$;

  constructor(private toastService: ToastService) {
   this.toasts$= this.toastService.Toast$; 
  }

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
