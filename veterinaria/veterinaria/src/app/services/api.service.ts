import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`API GET ${path} error:`, error);
        return throwError(() => error);
      })
    );
  }

  public post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`API POST ${path} error:`, error);
        return throwError(() => error);
      })
    );
  }
}
