import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient)
  constructor() {}

  get(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<any> {
    return this.http.get<any>(url, { params, headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP GET error:', error.message);
        return of(null); 
      })
    );
  }

  post(url: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post<any>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP POST error:', error.message);
        return of(null); 
      })
    );
  }

  patch(url: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.patch<any>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP PATCH error:', error.message);
        return of(null); 
      })
    );
  }

  put(url: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.put<any>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP PUT error:', error.message);
        return of(null); 
      })
    );
  }

  delete(url: string, headers?: HttpHeaders): Observable<any> {
    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP DELETE error:', error.message);
        return of(null); 
      })
    );
  }
}
