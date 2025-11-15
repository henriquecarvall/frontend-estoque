import { Injectable } from '@angular/core';

export interface Toast {
message: string;
type: 'success' | 'error' | 'warning' | 'info';
show: boolean;
id: number;
}

@Injectable({
providedIn: 'root'
})
export class ToastService {
toasts: Toast[] = [];
private nextId = 1;

show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    const toast: Toast = {
      message,
      type,
      show: false,
      id: this.nextId++
    };

    this.toasts.push(toast);

    setTimeout(() => {
      toast.show = true;
    }, 100);

    setTimeout(() => {
      this.remove(toast);
    }, 4000);
  }

  remove(toast: Toast) {
    toast.show = false;
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }, 300);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
