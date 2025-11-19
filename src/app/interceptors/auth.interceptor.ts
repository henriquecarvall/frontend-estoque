import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      const token = btoa(JSON.parse(usuario).email + ':' + Date.now());

      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
