import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface PaymentTransaction {
  method: string;
  amount: number;
  icon: string;
  color: string;
}

interface UserOrder {
  userId: string;
  userName: string;
  userAvatar: string;
  items: FoodItem[];
  subtotal: number;
}

interface FoodOrder {
  id: string;
  date: string;
  status: string;
  paymentMode: string;
  paymentTransactions?: PaymentTransaction[];
  total: number;
  deliveryTime: string;
  restaurant: string;
  orderType: 'individual' | 'group';
  items: FoodItem[];
  userOrders?: UserOrder[];
  groupInfo?: {
    totalUsers: number;
    organizer: string;
    splitType: 'equal' | 'individual';
  };
  deliveryAddress?: string;
  customerNotes?: string;
  restaurantPhone?: string;
  estimatedDelivery?: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  imports: [CommonModule],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  order: FoodOrder | null = null;
  expandedUser: string | null = null;
  loading = true;
  animatedItems = new Set<number>();

  // Mock data - in real app, this would come from a service
  orders: FoodOrder[] = [
    // Individual Order with multiple payment methods
    {
      id: 'FD-2024-001234',
      date: '2024-07-20',
      status: 'Delivered',
      paymentMode: 'Multiple Methods',
      paymentTransactions: [
        { method: 'Credit Card', amount: 25.00, icon: '💳', color: '#3b82f6' },
        { method: 'Gift Card', amount: 10.00, icon: '🎁', color: '#10b981' },
        { method: 'Cash', amount: 7.95, icon: '💵', color: '#059669' }
      ],
      total: 42.95,
      deliveryTime: '25 mins',
      restaurant: 'Burger Palace',
      orderType: 'individual',
      items: [
        { name: 'Classic Cheeseburger', price: 12.99, quantity: 2, image: '🍔', category: 'Burgers' },
        { name: 'Chocolate Milkshake', price: 5.99, quantity: 1, image: '🥤', category: 'Beverages' },
        { name: 'French Fries (Large)', price: 4.99, quantity: 1, image: '🍟', category: 'Sides' },
        { name: 'Onion Rings', price: 3.99, quantity: 1, image: '🧅', category: 'Sides' }
      ]
    },

    // Group Order with single payment method
    {
      id: 'FD-2024-001189',
      date: '2024-07-18',
      status: 'Delivered',
      paymentMode: 'Digital Wallet',
      paymentTransactions: [
        { method: 'Digital Wallet', amount: 85.50, icon: '📱', color: '#8b5cf6' }
      ],
      total: 85.50,
      deliveryTime: '35 mins',
      restaurant: 'Pizza Corner',
      orderType: 'group',
      items: [],
      groupInfo: {
        totalUsers: 4,
        organizer: 'Alex Johnson',
        splitType: 'individual'
      },
      userOrders: [
        {
          userId: 'user1',
          userName: 'Alex Johnson',
          userAvatar: '👨‍💼',
          subtotal: 23.97,
          items: [
            { name: 'Margherita Pizza (Medium)', price: 16.99, quantity: 1, image: '🍕', category: 'Pizza' },
            { name: 'Garlic Bread', price: 6.99, quantity: 1, image: '🍞', category: 'Sides' }
          ]
        },
        {
          userId: 'user2',
          userName: 'Sarah Wilson',
          userAvatar: '👩‍🎨',
          subtotal: 19.98,
          items: [
            { name: 'Pepperoni Pizza (Small)', price: 13.99, quantity: 1, image: '🍕', category: 'Pizza' },
            { name: 'Coca Cola', price: 2.99, quantity: 2, image: '🥤', category: 'Beverages' }
          ]
        },
        {
          userId: 'user3',
          userName: 'Mike Chen',
          userAvatar: '👨‍💻',
          subtotal: 22.97,
          items: [
            { name: 'Vegetarian Pizza (Medium)', price: 15.99, quantity: 1, image: '🍕', category: 'Pizza' },
            { name: 'Caesar Salad', price: 6.99, quantity: 1, image: '🥗', category: 'Salads' }
          ]
        },
        {
          userId: 'user4',
          userName: 'Emma Davis',
          userAvatar: '👩‍🔬',
          subtotal: 14.59,
          items: [
            { name: 'Chicken Wings (6pc)', price: 9.99, quantity: 1, image: '🍗', category: 'Appetizers' },
            { name: 'Lemonade', price: 3.99, quantity: 1, image: '🍋', category: 'Beverages' }
          ]
        }
      ]
    },

    // Individual Order with mixed payment methods
    {
      id: 'FD-2024-001156',
      date: '2024-07-15',
      status: 'On the Way',
      paymentMode: 'Mixed Payment',
      paymentTransactions: [
        { method: 'UPI', amount: 20.00, icon: '📲', color: '#f59e0b' },
        { method: 'Cash on Delivery', amount: 15.75, icon: '💵', color: '#059669' }
      ],
      total: 35.75,
      deliveryTime: '15 mins',
      restaurant: 'Taco Fiesta',
      orderType: 'individual',
      items: [
        { name: 'Chicken Tacos (3pc)', price: 15.99, quantity: 1, image: '🌮', category: 'Mexican' },
        { name: 'Beef Burrito', price: 12.99, quantity: 1, image: '🌯', category: 'Mexican' },
        { name: 'Guacamole & Chips', price: 6.99, quantity: 1, image: '🥑', category: 'Appetizers' }
      ]
    },

    // Group Order with complex payment split
    {
      id: 'FD-2024-001098',
      date: '2024-07-12',
      status: 'Preparing',
      paymentMode: 'Split Payment',
      paymentTransactions: [
        { method: 'Credit Card', amount: 50.00, icon: '💳', color: '#3b82f6' },
        { method: 'PayPal', amount: 35.45, icon: '🏦', color: '#0070ba' },
        { method: 'Gift Card', amount: 25.00, icon: '🎁', color: '#10b981' },
        { method: 'Cash', amount: 10.00, icon: '💵', color: '#059669' }
      ],
      total: 120.45,
      deliveryTime: '40 mins',
      restaurant: 'Sushi Zen',
      orderType: 'group',
      items: [],
      groupInfo: {
        totalUsers: 3,
        organizer: 'David Kim',
        splitType: 'equal'
      },
      userOrders: [
        {
          userId: 'user5',
          userName: 'David Kim',
          userAvatar: '👨‍🍳',
          subtotal: 42.95,
          items: [
            { name: 'Dragon Roll (8pc)', price: 22.99, quantity: 1, image: '🍣', category: 'Sushi' },
            { name: 'Chicken Teriyaki Bowl', price: 16.99, quantity: 1, image: '🍜', category: 'Bowls' },
            { name: 'Miso Soup', price: 2.99, quantity: 1, image: '🍲', category: 'Soup' }
          ]
        },
        {
          userId: 'user6',
          userName: 'Lisa Park',
          userAvatar: '👩‍🎤',
          subtotal: 38.96,
          items: [
            { name: 'California Roll (8pc)', price: 18.99, quantity: 1, image: '🍣', category: 'Sushi' },
            { name: 'Salmon Sashimi (6pc)', price: 16.99, quantity: 1, image: '🍣', category: 'Sashimi' },
            { name: 'Green Tea', price: 2.99, quantity: 1, image: '🍵', category: 'Beverages' }
          ]
        },
        {
          userId: 'user7',
          userName: 'Tom Rodriguez',
          userAvatar: '👨‍🎸',
          subtotal: 34.55,
          items: [
            { name: 'Spicy Tuna Roll (8pc)', price: 19.99, quantity: 1, image: '🍣', category: 'Sushi' },
            { name: 'Edamame', price: 5.99, quantity: 1, image: '🫘', category: 'Appetizers' },
            { name: 'Sake (Hot)', price: 8.99, quantity: 1, image: '🍶', category: 'Beverages' }
          ]
        }
      ]
    },

    // Individual Order with single payment method (backward compatibility)
    {
      id: 'FD-2024-001045',
      date: '2024-07-08',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 24.75,
      deliveryTime: '20 mins',
      restaurant: 'Dessert Heaven',
      orderType: 'individual',
      items: [
        { name: 'Chocolate Cake Slice', price: 8.99, quantity: 1, image: '🍰', category: 'Desserts' },
        { name: 'Vanilla Ice Cream', price: 4.99, quantity: 2, image: '🍨', category: 'Desserts' },
        { name: 'Fresh Juice', price: 5.99, quantity: 1, image: '🧃', category: 'Beverages' }
      ]
    }
  ];
  private animationTimeouts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      this.loadOrderDetails(orderId);
    });
  }

  ngOnDestroy() {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private loadOrderDetails(orderId: string) {
    // Simulate API call
    setTimeout(() => {
      this.order = this.orders.find(order => order.id === orderId) || null;
      this.loading = false;

      if (this.order) {
        this.startItemAnimations();
      }
    }, 500);
  }

  private startItemAnimations() {
    if (!this.order) return;

    const totalItems = this.order.orderType === 'individual'
      ? this.order.items.length
      : (this.order.userOrders?.reduce((sum, user) => sum + user.items.length, 0) || 0);

    for (let i = 0; i < totalItems; i++) {
      const timeout = setTimeout(() => {
        this.animatedItems.add(i);
      }, i * 100);
      this.animationTimeouts.push(timeout);
    }
  }

  goBack() {
    this.location.back();
  }

  toggleUserExpanded(userId: string) {
    this.expandedUser = this.expandedUser === userId ? null : userId;
  }

  reorderItems() {
    if (this.order) {
      console.log('Reordering items from order:', this.order.id);
      // Implement reorder logic
    }
  }

  trackOrder() {
    if (this.order) {
      console.log('Tracking order:', this.order.id);
      // Implement order tracking logic
    }
  }

  contactRestaurant() {
    if (this.order?.restaurantPhone) {
      window.open(`tel:${this.order.restaurantPhone}`);
    }
  }

  downloadReceipt() {
    if (this.order) {
      console.log('Downloading receipt for order:', this.order.id);
      // Implement receipt download logic
    }
  }

  reportIssue() {
    if (this.order) {
      console.log('Reporting issue for order:', this.order.id);
      // Implement issue reporting logic
    }
  }

  // Helper methods
  hasMultiplePayments(): boolean {
    return !!this.order?.paymentTransactions && this.order.paymentTransactions.length > 1;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateItemTotal(item: FoodItem): number {
    return item.price * item.quantity;
  }

  isItemAnimated(index: number): boolean {
    return this.animatedItems.has(index);
  }

  getOrderTypeIcon(orderType: string): string {
    return orderType === 'group' ? '👥' : '👤';
  }

  getOrderTypeLabel(): string {
    if (!this.order) return '';

    if (this.order.orderType === 'group' && this.order.groupInfo) {
      return `Group Order (${this.order.groupInfo.totalUsers} people)`;
    }
    return 'Individual Order';
  }

  getTotalItems(): number {
    if (!this.order) return 0;

    if (this.order.orderType === 'individual') {
      return this.order.items.reduce((total, item) => total + item.quantity, 0);
    } else if (this.order.orderType === 'group' && this.order.userOrders) {
      return this.order.userOrders.reduce((total, userOrder) =>
        total + userOrder.items.reduce((userTotal, item) => userTotal + item.quantity, 0), 0
      );
    }
    return 0;
  }

  getSubtotal(): number {
    if (!this.order) return 0;
    return this.order.total - 3.99; // Assuming $3.99 delivery fee
  }
}