import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'

interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  paymentMode: string;
  total: number;
  products: Product[];
}

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  expandedOrder: string | null = null;
  animatedOrders = new Set<number>();
  filter = 'all';
  searchTerm = '';

  orders: Order[] = [
    {
      id: 'ORD-2024-001234',
      date: '2024-07-20',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 248.97,
      products: [
        { name: 'Premium Wireless Headphones', price: 79.99, quantity: 1, image: '🎧' },
        { name: 'Bluetooth Speaker', price: 89.99, quantity: 1, image: '🔊' },
        { name: 'USB-C Cable (3ft)', price: 12.99, quantity: 2, image: '🔌' },
        { name: 'Phone Case', price: 24.99, quantity: 1, image: '📱' },
        { name: 'Screen Protector', price: 15.99, quantity: 2, image: '🛡️' }
      ]
    },
    {
      id: 'ORD-2024-001189',
      date: '2024-07-15',
      status: 'Shipped',
      paymentMode: 'PayPal',
      total: 156.48,
      products: [
        { name: 'Wireless Mouse', price: 45.99, quantity: 1, image: '🖱️' },
        { name: 'Mechanical Keyboard', price: 89.99, quantity: 1, image: '⌨️' },
        { name: 'Mouse Pad', price: 19.99, quantity: 1, image: '🖥️' }
      ]
    },
    {
      id: 'ORD-2024-001156',
      date: '2024-07-10',
      status: 'Processing',
      paymentMode: 'Debit Card',
      total: 89.97,
      products: [
        { name: 'Fitness Tracker', price: 79.99, quantity: 1, image: '⌚' },
        { name: 'Charging Cable', price: 9.99, quantity: 1, image: '🔌' }
      ]
    },
    {
      id: 'ORD-2024-001098',
      date: '2024-07-05',
      status: 'Delivered',
      paymentMode: 'Apple Pay',
      total: 324.95,
      products: [
        { name: 'Smart Watch', price: 199.99, quantity: 1, image: '⌚' },
        { name: 'Watch Band', price: 29.99, quantity: 1, image: '⌚' },
        { name: 'Wireless Charger', price: 49.99, quantity: 1, image: '🔋' },
        { name: 'Power Bank', price: 39.99, quantity: 1, image: '🔋' }
      ]
    },
    {
      id: 'ORD-2024-001045',
      date: '2024-06-28',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 67.98,
      products: [
        { name: 'Bluetooth Earbuds', price: 49.99, quantity: 1, image: '🎧' },
        { name: 'Carrying Case', price: 17.99, quantity: 1, image: '💼' }
      ]
    }
  ];

  private animationTimeouts: any[] = [];

  ngOnInit() {
    // Animate orders on mount
    this.orders.forEach((_, index) => {
      const timeout = setTimeout(() => {
        this.animatedOrders.add(index);
      }, index * 150);
      this.animationTimeouts.push(timeout);
    });
  }

  ngOnDestroy() {
    // Clear timeouts
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesFilter = this.filter === 'all' || order.status.toLowerCase() === this.filter.toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.products.some(product =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  }

  toggleExpanded(orderId: string) {
    this.expandedOrder = this.expandedOrder === orderId ? null : orderId;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  setFilter(status: string) {
    this.filter = status;
  }

  isAnimated(index: number): boolean {
    return this.animatedOrders.has(index);
  }

  calculateProductTotal(product: Product): number {
    return product.price * product.quantity;
  }
}
