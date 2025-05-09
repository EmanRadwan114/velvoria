import { Component, Input } from '@angular/core';
import { CustomDirective } from '../../../../directives/custom.directive';

@Component({
  selector: 'app-modal',
  imports: [CustomDirective],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() content = '';
  @Input() color = ''; // <--- receive color from parent
}
