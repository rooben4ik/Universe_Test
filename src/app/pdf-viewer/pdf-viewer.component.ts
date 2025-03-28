import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import NutrientViewer from '@nutrient-sdk/viewer';
import { HttpService } from '../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  imports:[],
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
})
export class PdfViewerComponent implements OnInit {
  documentId:any
  constructor(private route: ActivatedRoute,private httpService:HttpService,     public snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.documentId = params.get('id');
      this.httpService.getDocument(this.documentId).subscribe(
        (doc: any = {}) => {
          NutrientViewer.load({
            baseUrl: `${location.protocol}//${location.host}/assets/`,
            document: doc?.fileUrl,
            container: "#pspdfkit-container",
          }).then(instance => {
            (window as any).instance = instance;
          });
        },
        error => {
          this.snackBar.open('Error with loading document', '', { duration: 2000 });
        }
      );
    });




  }
 
  
}