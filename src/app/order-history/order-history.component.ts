import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserOrder {
  userId: string;
  userName: string;
  userAvatar: string;
  products: Product[];
  subtotal: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  paymentMode: string;
  total: number;
  orderType: 'individual' | 'group';
  products: Product[]; // For individual orders
  userOrders?: UserOrder[]; // For group orders
  groupInfo?: {
    totalUsers: number;
    organizer: string;
    splitType: 'equal' | 'individual';
  };
}

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  expandedOrder: string | null = null;
  expandedUser: string | null = null;
  animatedOrders = new Set<number>();
  filter = 'all';
  searchTerm = '';

  orders: Order[] = [
    // Individual Order
    {
      id: 'ORD-2024-001234',
      date: '2024-07-20',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 248.97,
      orderType: 'individual',
      products: [
        { name: 'Premium Wireless Headphones', price: 79.99, quantity: 1, image: '🎧' },
        { name: 'Bluetooth Speaker', price: 89.99, quantity: 1, image: '🔊' },
        { name: 'USB-C Cable (3ft)', price: 12.99, quantity: 2, image: '🔌' },
        { name: 'Phone Case', price: 24.99, quantity: 1, image: '📱' },
        { name: 'Screen Protector', price: 15.99, quantity: 2, image: '🛡️' }
      ]
    },

    // Group Order
    {
      id: 'ORD-2024-001189',
      date: '2024-07-15',
      status: 'Shipped',
      paymentMode: 'PayPal',
      total: 456.48,
      orderType: 'group',
      products: [], // Empty for group orders
      groupInfo: {
        totalUsers: 3,
        organizer: 'Alex Johnson',
        splitType: 'individual'
      },
      userOrders: [
        {
          userId: 'user1',
          userName: 'Alex Johnson',
          userAvatar: '👨‍💼',
          subtotal: 159.97,
          products: [
            { name: 'Wireless Mouse', price: 45.99, quantity: 1, image: '🖱️' },
            { name: 'Mechanical Keyboard', price: 89.99, quantity: 1, image: '⌨️' },
            { name: 'Mouse Pad', price: 23.99, quantity: 1, image: '🖥️' }
          ]
        },
        {
          userId: 'user2',
          userName: 'Sarah Wilson',
          userAvatar: '👩‍🎨',
          subtotal: 139.98,
          products: [
            { name: 'Graphic Tablet', price: 89.99, quantity: 1, image: '🎨' },
            { name: 'Stylus Pen', price: 49.99, quantity: 1, image: '✏️' }
          ]
        },
        {
          userId: 'user3',
          userName: 'Mike Chen',
          userAvatar: '👨‍💻',
          subtotal: 156.53,
          products: [
            { name: 'External Monitor', price: 129.99, quantity: 1, image: '🖥️' },
            { name: 'HDMI Cable', price: 14.99, quantity: 1, image: '🔌' },
            { name: 'Monitor Stand', price: 11.55, quantity: 1, image: '🔧' }
          ]
        }
      ]
    },

    // Individual Order
    {
      id: 'ORD-2024-001156',
      date: '2024-07-10',
      status: 'Processing',
      paymentMode: 'Debit Card',
      total: 89.97,
      orderType: 'individual',
      products: [
        { name: 'Fitness Tracker', price: 79.99, quantity: 1, image: '⌚' },
        { name: 'Charging Cable', price: 9.99, quantity: 1, image: '🔌' }
      ]
    },

    // Group Order
    {
      id: 'ORD-2024-001098',
      date: '2024-07-05',
      status: 'Delivered',
      paymentMode: 'Apple Pay',
      total: 624.95,
      orderType: 'group',
      products: [],
      groupInfo: {
        totalUsers: 4,
        organizer: 'David Kim',
        splitType: 'equal'
      },
      userOrders: [
        {
          userId: 'user4',
          userName: 'David Kim',
          userAvatar: '👨‍🍳',
          subtotal: 199.99,
          products: [
            { name: 'Smart Watch', price: 199.99, quantity: 1, image: '⌚' }
          ]
        },
        {
          userId: 'user5',
          userName: 'Lisa Park',
          userAvatar: '👩‍🎤',
          subtotal: 169.97,
          products: [
            { name: 'Wireless Earbuds', price: 129.99, quantity: 1, image: '🎧' },
            { name: 'Charging Case', price: 39.99, quantity: 1, image: '🔋' }
          ]
        },
        {
          userId: 'user6',
          userName: 'Tom Rodriguez',
          userAvatar: '👨‍🎸',
          subtotal: 124.99,
          products: [
            { name: 'Bluetooth Speaker', price: 89.99, quantity: 1, image: '🔊' },
            { name: 'Speaker Stand', price: 34.99, quantity: 1, image: '🎵' }
          ]
        },
        {
          userId: 'user7',
          userName: 'Emma Davis',
          userAvatar: '👩‍🔬',
          subtotal: 130.00,
          products: [
            { name: 'Power Bank', price: 49.99, quantity: 1, image: '🔋' },
            { name: 'Wireless Charger', price: 39.99, quantity: 2, image: '⚡' }
          ]
        }
      ]
    },

    // Individual Order
    {
      id: 'ORD-2024-001045',
      date: '2024-06-28',
      status: 'Delivered',
      paymentMode: 'Credit Card',
      total: 67.98,
      orderType: 'individual',
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
      }, index * 200);
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
      const matchesSearch = this.matchesSearchTerm(order);
      return matchesFilter && matchesSearch;
    });
  }

  private matchesSearchTerm(order: Order): boolean {
    const searchLower = this.searchTerm.toLowerCase();
    
    // Search in order ID
    if (order.id.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Search in individual order products
    if (order.orderType === 'individual') {
      return order.products.some(product => 
        product.name.toLowerCase().includes(searchLower)
      );
    }

    // Search in group order user names and products
    if (order.orderType === 'group' && order.userOrders) {
      return order.userOrders.some(userOrder => 
        userOrder.userName.toLowerCase().includes(searchLower) ||
        userOrder.products.some(product => product.name.toLowerCase().includes(searchLower))
      );
    }

    return false;
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
    if (this.expandedOrder !== orderId) {
      this.expandedUser = null; // Reset expanded user when collapsing order
    }
  }

  toggleUserExpanded(userId: string) {
    this.expandedUser = this.expandedUser === userId ? null : userId;
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

  getTotalItems(order: Order): number {
    if (order.orderType === 'individual') {
      return order.products.reduce((total, product) => total + product.quantity, 0);
    } else if (order.orderType === 'group' && order.userOrders) {
      return order.userOrders.reduce((total, userOrder) => 
        total + userOrder.products.reduce((userTotal, product) => userTotal + product.quantity, 0), 0
      );
    }
    return 0;
  }

  getOrderTypeIcon(orderType: string): string {
    return orderType === 'group' ? '👥' : '👤';
  }

  getOrderTypeLabel(order: Order): string {
    if (order.orderType === 'group' && order.groupInfo) {
      return `Group Order (${order.groupInfo.totalUsers} people)`;
    }
    return 'Individual Order';
  }

  getAllItemThumbnails(order: Order): string[] {
    if (order.orderType === 'individual') {
      return order.products.slice(0, 4).map(product => product.image);
    } else if (order.orderType === 'group' && order.userOrders) {
      const allProducts = order.userOrders.flatMap(userOrder => userOrder.products);
      const uniqueProducts = allProducts.filter((product, index, arr) => 
        arr.findIndex(p => p.image === product.image) === index
      );
      return uniqueProducts.slice(0, 4).map(product => product.image);
    }
    return [];
  }

  getTotalUniqueItems(order: Order): number {
    if (order.orderType === 'individual') {
      return order.products.length;
    } else if (order.orderType === 'group' && order.userOrders) {
      const allProducts = order.userOrders.flatMap(userOrder => userOrder.products);
      const uniqueProducts = allProducts.filter((product, index, arr) => 
        arr.findIndex(p => p.name === product.name) === index
      );
      return uniqueProducts.length;
    }
    return 0;
  }

  getProductName(order: Order, index: number): string {
    if (order.orderType === 'individual') {
      return order.products[index]?.name || '';
    } else if (order.orderType === 'group' && order.userOrders) {
      const allProducts = order.userOrders.flatMap(userOrder => userOrder.products);
      const uniqueProducts = allProducts.filter((product, idx, arr) => 
        arr.findIndex(p => p.image === product.image) === idx
      );
      return uniqueProducts[index]?.name || '';
    }
    return '';
  }
}