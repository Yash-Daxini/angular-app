import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "../services/api.service";
// import html2pdf from 'html2pdf.js'

@Component({
  imports: [CommonModule],
  selector: 'order-receipt-download',
  templateUrl: './order-receipt-download.component.html',
  styleUrls: ['./order-receipt-download.component.css']
})
export class OrderReceiptDownloadComponent implements OnInit, OnDestroy {
  isGenerating = true;
  isDownloading = true;
  showSuccess = true;
  progress = 0;

  constructor(private apiService: ApiService) { }

  private progressInterval: any;

  ngOnInit() {
    this.apiService.get<string>().subscribe(
      (value) => {
        this.downloadFile(value);
      },
      (err) => {
        console.error(err);
      },
    );
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private downloadFile(receiptContent: string) {
    const receiptDiv = document.getElementById('receiptDiv');
    if (receiptDiv) {
      receiptDiv.textContent = receiptContent;
    }
    var element = document.getElementById('receiptDiv');
    var opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    // html2pdf().from(element).set(opt).save().then(() => {
    //   this.isGenerating = false;
    //   this.isDownloading = false;
    //   this.showSuccess = true;
    //   this.progress = 100;
    // });
  }

  restartDownload() {
    // this.isGenerating = true;
    // this.isDownloading = false;
    // this.showSuccess = false;
    // this.progress = 0;

    // Restart the entire process
    // this.startDownload();
  }
}
