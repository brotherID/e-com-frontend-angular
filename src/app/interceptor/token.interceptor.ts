import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const protectedUrls = [
    'http://localhost:9999/api/v1/products',
    'http://localhost:9999/api/v1/promotions',
  ];

  console.log(
    'Comparaison des URLs :',
    req.url,
    protectedUrls.some((url) => req.url.startsWith(url))
  );

  if (token && protectedUrls.some((url) => req.url.startsWith(url))) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
