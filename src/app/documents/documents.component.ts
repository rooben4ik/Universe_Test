import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
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
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

interface Document {
  id: string;
  name: string;
  status: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

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
    MatDialogModule
  ]
})
export class DocumentsComponent implements AfterViewInit {
  @ViewChild('addDocumentTemplate', { static: false }) addDocumentTemplate!: TemplateRef<any>;
  @ViewChild('editDocumentTemplate', { static: false }) editDocumentTemplate!: TemplateRef<any>;
  userInfo:any
  newDocument: any = {
    name: '',
    status: 'DRAFT',
    file: null, 
  };

  documents: Document[] = [];

  displayedColumns: string[] = ['id', 'name', 'status', 'creator', 'fileUrl', 'createdAt', 'updatedAt', 'actions'];

  constructor( public tokenService:TokenService, public dialog:MatDialog, public snackBar :MatSnackBar, public router:Router,public httpService:HttpService){
    if (!this.tokenService.getToken()) {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit(){
    this.httpService.getUser().subscribe(
      response => {
        console.log(response)
        this.userInfo = response
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
  ngAfterViewInit() {
    if (!this.addDocumentTemplate || !this.editDocumentTemplate) {
      console.error('Template references are not defined correctly');
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

  editDocument(document: Document) {
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
      this.snackBar.open('Document added successfully!', '', { duration: 2000 });
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

  addDocument(newDocument: Document) {
    this.documents.push(newDocument);
    this.snackBar.open('Document added successfully!', '', { duration: 2000 });
  }

  updateDocument(updatedDocument: Document) {
    const index = this.documents.findIndex(doc => doc.id === updatedDocument.id);
    if (index !== -1) {
      this.documents[index] = updatedDocument;
      this.snackBar.open('Document updated successfully!', '', { duration: 2000 });
    }
  }

  deleteDocument(document: Document) {
    if (document.status === 'DRAFT' || document.status === 'REVOKED') {
      this.documents = this.documents.filter(doc => doc.id !== document.id);
      this.snackBar.open('Document deleted successfully!', '', { duration: 2000 });
    }
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
}
