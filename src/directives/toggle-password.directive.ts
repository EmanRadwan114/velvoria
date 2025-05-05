import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]',
})
export class TogglePasswordDirective {
  //use !: means -> I promise this will be assigned before it's used (non null assertion)
  private targetInput!: HTMLInputElement;
  private isVisible = false;

  constructor(public element: ElementRef) {}
  @HostListener('click')
  togglePassword(): void {
    this.isVisible = !this.isVisible;
    if (this.targetInput) {
      const icon = this.element.nativeElement.classList;
      if (icon.contains('fa-eye')) {
        icon.remove('fa-eye');
        icon.add('fa-eye-slash');
        this.targetInput.type = 'text';
      } else {
        icon.remove('fa-eye-slash');
        icon.add('fa-eye');
        this.targetInput.type = 'password';
      }
    }
  }
  @Input('appTogglePassword')
  set setTargetInput(input: HTMLInputElement) {
    this.targetInput = input;
  }
}
