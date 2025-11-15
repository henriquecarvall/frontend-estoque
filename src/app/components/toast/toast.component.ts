import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
selector: 'app-toast',
templateUrl: './toast.component.html',
styleUrls: ['./toast.component.css']
})
export class ToastComponent {
constructor(public toastService: ToastService) {}

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || '💡';
  }
}
