import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrderReceiptDownloadComponent } from './order-receipt/order-receipt-download.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'order-receipt', component: OrderReceiptDownloadComponent }
];
