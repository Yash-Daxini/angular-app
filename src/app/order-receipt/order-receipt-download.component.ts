import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { ApiService } from "../services/api.service";
import { get } from "http";
import { HttpEventType } from "@angular/common/http";

@Component({
  imports: [CommonModule],
  selector: 'order-receipt-download',
  templateUrl: './order-receipt-download.component.html',
  styleUrls: ['./order-receipt-download.component.css']
})
export class OrderReceiptDownloadComponent implements OnInit, OnDestroy {
  isGenerating = true;
  isDownloading = false;
  showSuccess = false;
  progress = 0;
  receiptContent: string = '';

  constructor(private apiService: ApiService, private ngZone: NgZone) { }

  ngOnInit(): void {
    // this.resetGenerationState();
    // this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.getReceiptContent();
        // });
      }, 0);
    });
  }

  ngOnDestroy() {
  }

  private getReceiptContent() {
    this.apiService.get().subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * (event.loaded / (event.total || 1)));
        console.log(`Upload progress: ${this.progress}%`);
      } else if (event.type === HttpEventType.Response) {
        console.log('Upload complete!', event.body);
        this.progress = 100; // Ensure progress is 100% when complete
        this.downloadFile();
      }
    });
  }

  private downloadFile() {
    this.setDownloading();
    const receiptDiv = document.getElementById('receiptDiv');
    var opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    if (typeof window !== 'undefined') {
      import('html2pdf.js').then((module) => {
        const html2pdf = module.default || module;
        html2pdf().from(receiptDiv).set(opt).save().then(() => {
          this.ngZone.run(() => {
            this.setSuccess(); // This sets your flag like this.showSuccess = true;
            console.warn(this.showSuccess);
          });
        });
      });
    }
  }

  private setDownloading() {
    this.isGenerating = false;
    this.isDownloading = true;
    this.showSuccess = false;
  }

  private setSuccess() {
    this.isGenerating = false;
    this.isDownloading = false;
    this.showSuccess = true;
  }

  private resetGenerationState() {
    this.isGenerating = true;
    this.isDownloading = false;
    this.showSuccess = false;
    this.progress = 0;
  }

  restartDownload() {
    this.resetGenerationState();

    this.getReceiptContent();
  }
}
