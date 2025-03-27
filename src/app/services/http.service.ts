import { Injectable, signal  } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, catchError, map, of} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  loadingSignal = signal(false);
  errorSignal = signal<any | null>(null);
  dataSignal = signal<any | null>(null);
  apiUrl = 'https://legaltech-testing.coobrick.app/api/v1/';

  constructor(private apiService: ApiService, private tokenService: TokenService) { }
  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken() || ''}`,
    });
  }
  // User endp
  getUser(): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.get(this.apiUrl + 'user', undefined, this.headers ).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
        return of(null);
      })
    );
  }
  getUsersList(page:any,size:any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.get(this.apiUrl + `user/users?page=${page}&size=${size}`, undefined, this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
        return of(null);
      })
    );
  }
  registerUser(body: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + 'user/register', body).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  //Auth endp
  authControl(body: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + 'auth/login', body).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  // Document endp
  createDocument(formData: FormData): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + 'document', formData,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  sendToReviewDocument(id:any,body: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + `document/${id}/send-to-review`, body,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  sendToRevokeDocument(id:any,): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + `document/${id}/revoke-review`, undefined,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  changeStatusDocument(id:any,body: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.post(this.apiUrl + `document/${id}/change-status`, body,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  UpdateDocument(id:any,body: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.patch(this.apiUrl + `document/${id}`, body,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message); 
        return of(null);
      })
    );
  }
  getDocument(id:any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.get(this.apiUrl + `document/${id}`,undefined, this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
        return of(null);
      })
    );
  }
  getDocumentsList(params: any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.get(this.apiUrl + `document`, params , this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
        return of(null);
      })
    );
  }
  deleteDocument(id:any): Observable<any> {
    this.loadingSignal.set(true); 
    return this.apiService.delete(this.apiUrl + `document/${id}`,this.headers).pipe(
      map((response) => {
        this.loadingSignal.set(false);
        this.dataSignal.set(response); 
        return response;
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(error.message);
        return of(null);
      })
    );
  }
}


