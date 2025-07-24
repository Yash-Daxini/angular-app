import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface FoodOrder {
  id: string;
  date: string;
  status: string;
  paymentMode: string;
  total: number;
  deliveryTime: string;
  restaurant: string;
  items: FoodItem[];
}

@Component({
  selector: 'app-food-order-history',
  templateUrl: './food-order-history.component.html',
  styleUrls: ['./food-order-history.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FoodOrderHistoryComponent implements OnInit, OnDestroy {
  expandedOrder: string | null = null;
  animatedOrders = new Set<number>();
  filter = 'all';
  searchTerm = '';

  orders: FoodOrder[] = [
    {
      id: 'FD-2024-001234',
      date: '2024-07-20',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 42.95,
      deliveryTime: '25 mins',
      restaurant: 'Burger Palace',
      items: [
        { name: 'Classic Cheeseburger', price: 12.99, quantity: 2, image: '🍔', category: 'Burgers' },
        { name: 'Chocolate Milkshake', price: 5.99, quantity: 1, image: '🥤', category: 'Beverages' },
        { name: 'French Fries (Large)', price: 4.99, quantity: 1, image: '🍟', category: 'Sides' },
        { name: 'Onion Rings', price: 3.99, quantity: 1, image: '🧅', category: 'Sides' }
      ]
    },
    {
      id: 'FD-2024-001189',
      date: '2024-07-18',
      status: 'Delivered',
      paymentMode: 'Digital Wallet',
      total: 28.50,
      deliveryTime: '30 mins',
      restaurant: 'Pizza Corner',
      items: [
        { name: 'Margherita Pizza (Medium)', price: 16.99, quantity: 1, image: '🍕', category: 'Pizza' },
        { name: 'Garlic Bread', price: 6.99, quantity: 1, image: '🍞', category: 'Sides' },
        { name: 'Coca Cola', price: 2.99, quantity: 2, image: '🥤', category: 'Beverages' }
      ]
    },
    {
      id: 'FD-2024-001156',
      date: '2024-07-15',
      status: 'On the Way',
      paymentMode: 'Cash on Delivery',
      total: 35.75,
      deliveryTime: '15 mins',
      restaurant: 'Taco Fiesta',
      items: [
        { name: 'Chicken Tacos (3pc)', price: 15.99, quantity: 1, image: '🌮', category: 'Mexican' },
        { name: 'Beef Burrito', price: 12.99, quantity: 1, image: '🌯', category: 'Mexican' },
        { name: 'Guacamole & Chips', price: 6.99, quantity: 1, image: '🥑', category: 'Appetizers' }
      ]
    },
    {
      id: 'FD-2024-001098',
      date: '2024-07-12',
      status: 'Preparing',
      paymentMode: 'UPI',
      total: 52.80,
      deliveryTime: '40 mins',
      restaurant: 'Sushi Zen',
      items: [
        { name: 'California Roll (8pc)', price: 18.99, quantity: 1, image: '🍣', category: 'Sushi' },
        { name: 'Chicken Teriyaki Bowl', price: 16.99, quantity: 1, image: '🍜', category: 'Bowls' },
        { name: 'Miso Soup', price: 4.99, quantity: 1, image: '🍲', category: 'Soup' },
        { name: 'Green Tea', price: 2.99, quantity: 1, image: '🍵', category: 'Beverages' },
        { name: 'Edamame', price: 5.99, quantity: 1, image: '🫘', category: 'Appetizers' }
      ]
    },
    {
      id: 'FD-2024-001045',
      date: '2024-07-08',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 24.75,
      deliveryTime: '20 mins',
      restaurant: 'Dessert Heaven',
      items: [
        { name: 'Chocolate Cake Slice', price: 8.99, quantity: 1, image: '🍰', category: 'Desserts' },
        { name: 'Vanilla Ice Cream', price: 4.99, quantity: 2, image: '🍨', category: 'Desserts' },
        { name: 'Fresh Juice', price: 5.99, quantity: 1, image: '🧃', category: 'Beverages' }
      ]
    }
  ];

  private animationTimeouts: any[] = [];

  ngOnInit() {
    // Animate orders on mount with staggered effect
    this.orders.forEach((_, index) => {
      const timeout = setTimeout(() => {
        this.animatedOrders.add(index);
      }, index * 200); // Slightly slower for food theme
      this.animationTimeouts.push(timeout);
    });
  }

  ngOnDestroy() {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  get filteredOrders(): FoodOrder[] {
    return this.orders.filter(order => {
      const matchesFilter = this.filter === 'all' || order.status.toLowerCase().replace(/\s+/g, '') === this.filter.toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.restaurant.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.items.some(item => 
                             item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                           );
      return matchesFilter && matchesSearch;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'On the Way':
        return 'status-ontheway';
      case 'Preparing':
        return 'status-preparing';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'On the Way':
        return 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0';
      case 'Preparing':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
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

  calculateItemTotal(item: FoodItem): number {
    return item.price * item.quantity;
  }

  getTotalItems(order: FoodOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}