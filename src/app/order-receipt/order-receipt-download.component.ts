import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
  imports:[CommonModule],
  selector: 'order-receipt-download',
  templateUrl: './order-receipt-download.component.html',
  styleUrls: ['./order-receipt-download.component.css']
})
export class OrderReceiptDownloadComponent implements OnInit {
  isGenerating = true;
  isDownloading = true;
  showSuccess = true;
  progress = 0;

  orderData = {
    orderId: 'ORD-2024-001234',
    date: '2024-07-08',
    total: '$128.50',
    items: 3,
    status: 'Delivered'
  };

  private progressInterval: any;

  ngOnInit() {
    // this.startDownload();
  }

  ngOnDestroy() {
    // if (this.progressInterval) {
    //   clearInterval(this.progressInterval);
    // }
  }

  private startDownload() {
    // Phase 1: Generate receipt
    // this.progressInterval = setInterval(() => {
    //   this.progress += 10;
    //   if (this.progress >= 100) {
    //     clearInterval(this.progressInterval);
    //     // Phase 2: Start download after generation
    //     setTimeout(() => {
    //       this.isGenerating = false;
    //       this.isDownloading = true;
          
    //       // Phase 3: Complete download
    //       setTimeout(() => {
    //         this.isDownloading = false;
    //         this.showSuccess = true;
            
            // Simulate actual download
            this.downloadFile();
    //       }, 1500);
    //     }, 500);
    //   }
    // }, 200);
  }

  private downloadFile() {
    const receiptContent = `Order Receipt\n\nOrder ID: ${this.orderData.orderId}\nDate: ${this.orderData.date}\nTotal: ${this.orderData.total}\nItems: ${this.orderData.items}\nStatus: ${this.orderData.status}`;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${this.orderData.orderId}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  restartDownload() {
    this.isGenerating = true;
    this.isDownloading = false;
    this.showSuccess = false;
    this.progress = 0;
    
    // Restart the entire process
    this.startDownload();
  }
}