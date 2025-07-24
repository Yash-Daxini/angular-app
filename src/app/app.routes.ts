import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrderReceiptDownloadComponent } from './order-receipt/order-receipt-download.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { FoodOrderHistoryComponent } from './food-order-history/food-order-history.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'order-receipt', component: OrderReceiptDownloadComponent },
    { path: 'order-history', component: OrderHistoryComponent },
    { path: 'food-order-history', component: FoodOrderHistoryComponent }
];
