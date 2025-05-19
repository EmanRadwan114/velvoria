import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appCustom]', // This will be used in the parent component's template
})
export class CustomDirective implements OnChanges {
  @Input('appCustom') bgColor: string = ''; // Input to accept the color value

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bgColor']) {
      this.el.nativeElement.style.color = this.bgColor;
    }
  }
}
