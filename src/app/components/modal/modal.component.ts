import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  
  @Input() title: string;
  // @Input() content: string | string[] | TemplateRef<any>;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() displaySaveBtn = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<void>();
  @Input() template: TemplateRef<any>;

  close() {
    this.closeModal.emit();
  }
  save() {
    this.saveData.emit();
  }

  // ngOnDestroy() { }


}
