import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

 interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
 
  constructor() { }

  private toastsSubject=new BehaviorSubject<Toast[]>([]);
  Toast$=this.toastsSubject.asObservable(); //show to all comp and with any update
   private counter = 0;
   
  show(type:Toast['type'],message:string)
  {
    const id = this.counter++;
    const newToast: Toast = { id, type, message };
    let currentArrayToasts=this.toastsSubject.value;
    this.toastsSubject.next([newToast,...currentArrayToasts]);
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number) {
    const filtered = this.toastsSubject.value.filter(toast => toast.id !== id);
    this.toastsSubject.next(filtered);
  }
}
