import { Component, ViewChild, AfterViewInit, signal,  effect, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TokenService } from '../services/token.service';
import { HttpService } from '../services/http.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class DocumentsComponent implements AfterViewInit {
  @ViewChild('addDocumentTemplate', { static: false }) addDocumentTemplate!: TemplateRef<any>;
  @ViewChild('editDocumentTemplate', { static: false }) editDocumentTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _liveAnnouncer = inject(LiveAnnouncer);
  statusFilter: string = '';
  userInfo: any;
  changedStatus:any;
  documentName:any;
  docId:any;
  userList:any;
  creatorFilter:any;
  newDocument: any = {
    name: '',
    status: 'DRAFT',
    file: null,
  };
  sortedFile:any;
  currentPage = signal(1);
  pageSize = signal(5);
  documents: any[] = [];
  public dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'status', 'createdAt', 'updatedAt', 'actions'];
  documentsSignal = signal<any[]>([]);
  loadingSignal = signal(false);
  constructor(
    public tokenService: TokenService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    public httpService: HttpService
  ) {
    if (!this.tokenService.getToken()) {
      this.router.navigate(['/login']);
    }
    effect(() => {
      this.loadDocuments();
    });
  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource();
    this.httpService.getUser().subscribe(
      response => {
        this.userInfo = response;
        if (this.userInfo?.role === 'REVIEWER') {
          const index = this.displayedColumns.length - 1; 
          this.displayedColumns.splice(index, 0, 'creator'); 
        }        },

      error => {
        const errorMessage = error?.error?.message;
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );
    if(this.userInfo?.role === 'REVIEWER'){
      this.httpService.getUsersList(1,100).subscribe(
        response => {
          this.userList = response?.results;
         },
  
        error => {
          const errorMessage = error?.error?.message;
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['mat-warn'],
          });
        }
      );
    }

  }

    ngAfterViewInit() {
      if (this.paginator) {
        this.paginator.page.subscribe(event => {
          this.currentPage.set(event.pageIndex + 1);
          this.pageSize.set(event.pageSize);
          this.loadDocuments();
        });
      }
      if (this.sort) {
        this.sort.sortChange.subscribe(() => {
          this.loadDocuments(); 
        });
      }
    }

  openAddDocumentDialog() {
    const dialogRef = this.dialog.open(this.addDocumentTemplate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addDocument(result);
      }
    });
  }

  editDocument(document: any) {
    this.docId = document?.id
    this.documentName = document?.name
    const dialogRef = this.dialog.open(this.editDocumentTemplate, { data: document });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateDocument(result);
      }
    });
  }

  onSubmitAddDocument() {
    if (this.newDocument.name && this.newDocument.status) {
      this.documents.push(this.newDocument);

      this.newDocument = {
        id: '',
        name: '',
        status: 'DRAFT',
        fileUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: { id: '', email: '', fullName: '', role: 'USER' }
      };
    }
  }

  onSubmitEditDocument() {
    const documentToEdit = this.documents.find(doc => doc.id === this.newDocument.id);
    if (documentToEdit) {
      documentToEdit.name = this.newDocument.name;
      documentToEdit.status = this.newDocument.status;
      documentToEdit.fileUrl = this.newDocument.fileUrl;
      documentToEdit.updatedAt = new Date().toISOString();
      documentToEdit.creator = this.newDocument.creator;
      this.snackBar.open('Document updated successfully!', '', { duration: 2000 });
    }
  }

  addDocument(newDocument: any) {
    this.documents.push(newDocument);
    this.snackBar.open('Document added successfully!', '', { duration: 2000 });
  }

  updateDocument(updatedDocument: any) {
    const index = this.documents.findIndex(doc => doc.id === updatedDocument.id);
    if (index !== -1) {
      this.documents[index] = updatedDocument;
      this.snackBar.open('Document updated successfully!', '', { duration: 2000 });
    }
  }

  deleteDocument(document: any) {
    this.httpService.deleteDocument(document?.id).subscribe(
      (response: any) => {
        this.snackBar.open('Document deleted successfully!', '', { duration: 2000 });
          this.loadDocuments();
              },
      (error) => {
        const errorMessage = error?.error?.message || 'Try one more time';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );
  }
  revokeDocument(document: any) {
    this.httpService.sendToRevokeDocument(document?.id).subscribe(
      (response: any) => {
        this.snackBar.open('Document revoked successfully!', '', { duration: 2000 });
          this.loadDocuments();
              },
      (error) => {
        const errorMessage = error?.error?.message || 'Try one more time';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newDocument.file = file;
    }
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  closeAddDocumentDialog() {
    this.dialog.closeAll();
  }

  get loading() {
    return this.httpService.loadingSignal();
  }

  sendReq() {
    if (!this.newDocument.name || !this.newDocument.status || !this.newDocument.file) {
      this.snackBar.open('Please check all rows', '', {
        duration: 2000,
        panelClass: ['mat-warn']
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newDocument.name);
    formData.append('status', this.newDocument.status);
    formData.append('file', this.newDocument.file);

    this.httpService.createDocument(formData).subscribe(
      (response: any) => {
        this.snackBar.open('Document added successfully!', '', { duration: 2000 });
        this.dialog.closeAll();
        this.newDocument = { name: '', status: 'DRAFT', file: null };
          this.loadDocuments();
             },
      (error) => {
        const errorMessage = error?.error?.message || 'Retry 1 more time';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );
  }

  loadDocuments() {
    const page = this.currentPage();
    const size = this.pageSize();
    this.dataSource.data = []
    const params: any = { page, size };
    if (this.statusFilter) {
      params.status = this.statusFilter;
    }
    if (this.creatorFilter) {
      params.creatorId = this.creatorFilter;

    }
    if (this.sortedFile) {
      params.sort = this.sortedFile;

    }
    this.loadingSignal.set(true);
    this.httpService.getDocumentsList(params).subscribe(
      (docs: any = {}) => {
        if(this.userInfo?.role === 'REVIEWER'){
          let filteredDocs = docs?.results || [];
          // filteredDocs = filteredDocs.filter((doc:any) => doc.status !== 'Draft');
          this.documentsSignal.set(filteredDocs);
          this.dataSource.data = this.documentsSignal();
        }
        else{
          this.documentsSignal.set(docs?.results || []);
          this.dataSource.data = this.documentsSignal();  
        }
        if (this.paginator) {
          this.paginator.length = docs?.count || 0;
        }

        this.loadingSignal.set(false);
      },
      error => {
        this.snackBar.open('Error loading documents', '', { duration: 2000 });
        this.loadingSignal.set(false);
      }
    );

  }
  
  applyStatusFilter(status: string) {   
    this.statusFilter = status;

    this.loadDocuments()
  }
  applyCreatorFilter(creator: string) {   
    this.creatorFilter = creator;

    this.loadDocuments()
  }
  changeStatus(status:any) {   
    this.httpService.changeStatusDocument(this.docId,{status:status}).subscribe(
      (response: any) => {
        this.snackBar.open('Document changed successfully!', '', { duration: 2000 });
        this.dialog.closeAll();
        this.newDocument = { name: '', status: 'DRAFT', file: null };
          this.loadDocuments();
             },
      (error) => {
        const errorMessage = error?.error?.message || 'Retry 1 more time';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );

  }
  updateStatus(status:any) {   
    this.httpService.UpdateDocument(this.docId,{name:status}).subscribe(
      (response: any) => {
        this.snackBar.open('Document changed successfully!', '', { duration: 2000 });
        this.dialog.closeAll();
        this.newDocument = { name: '', status: 'DRAFT', file: null };
          this.loadDocuments();
             },
      (error) => {
        const errorMessage = error?.error?.message || 'Retry 1 more time';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      }
    );

  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.sortedFile = `${sortState.active},${sortState.direction}`
      this.loadDocuments()
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
      this.sortedFile = undefined
      this.loadDocuments()
    }
  }
  openDocument(doc: any): void {
    const url = `/document/${doc.id}`;
    window.open(url, '_blank'); 
  }
}
