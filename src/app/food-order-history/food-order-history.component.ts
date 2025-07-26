import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
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
  total: number;
  deliveryTime: string;
  restaurant: string;
  orderType: 'individual' | 'group';
  items: FoodItem[]; // For individual orders
  userOrders?: UserOrder[]; // For group orders
  groupInfo?: {
    totalUsers: number;
    organizer: string;
    splitType: 'equal' | 'individual';
  };
}

@Component({
  selector: 'app-food-order-history',
  templateUrl: './food-order-history.component.html',
  styleUrls: ['./food-order-history.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FoodOrderHistoryComponent implements OnInit, OnDestroy {
  expandedOrder: string | null = null;
  expandedUser: string | null = null;
  animatedOrders = new Set<number>();
  filter = 'all';
  searchTerm = '';

  orders: FoodOrder[] = [
    // Individual Order
    {
      id: 'FD-2024-001234',
      date: '2024-07-20',
      status: 'Delivered',
      paymentMode: 'Credit Card',
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

    // Group Order
    {
      id: 'FD-2024-001189',
      date: '2024-07-18',
      status: 'Delivered',
      paymentMode: 'Digital Wallet',
      total: 85.50,
      deliveryTime: '35 mins',
      restaurant: 'Pizza Corner',
      orderType: 'group',
      items: [], // Empty for group orders
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

    // Individual Order
    {
      id: 'FD-2024-001156',
      date: '2024-07-15',
      status: 'On the Way',
      paymentMode: 'Cash on Delivery',
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

    // Group Order
    {
      id: 'FD-2024-001098',
      date: '2024-07-12',
      status: 'Preparing',
      paymentMode: 'UPI',
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

    // Individual Order
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

  ngOnInit() {
    this.orders.forEach((_, index) => {
      const timeout = setTimeout(() => {
        this.animatedOrders.add(index);
      }, index * 200);
      this.animationTimeouts.push(timeout);
    });
  }

  ngOnDestroy() {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  get filteredOrders(): FoodOrder[] {
    return this.orders.filter(order => {
      const matchesFilter = this.filter === 'all' || order.status.toLowerCase().replace(/\s+/g, '') === this.filter.toLowerCase();
      const matchesSearch = this.matchesSearchTerm(order);
      return matchesFilter && matchesSearch;
    });
  }

  private matchesSearchTerm(order: FoodOrder): boolean {
    const searchLower = this.searchTerm.toLowerCase();
    
    // Search in order ID and restaurant
    if (order.id.toLowerCase().includes(searchLower) || 
        order.restaurant.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Search in individual order items
    if (order.orderType === 'individual') {
      return order.items.some(item => 
        item.name.toLowerCase().includes(searchLower)
      );
    }

    // Search in group order user names and items
    if (order.orderType === 'group' && order.userOrders) {
      return order.userOrders.some(userOrder => 
        userOrder.userName.toLowerCase().includes(searchLower) ||
        userOrder.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }

    return false;
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

  calculateItemTotal(item: FoodItem): number {
    return item.price * item.quantity;
  }

  getTotalItems(order: FoodOrder): number {
    if (order.orderType === 'individual') {
      return order.items.reduce((total, item) => total + item.quantity, 0);
    } else if (order.orderType === 'group' && order.userOrders) {
      return order.userOrders.reduce((total, userOrder) => 
        total + userOrder.items.reduce((userTotal, item) => userTotal + item.quantity, 0), 0
      );
    }
    return 0;
  }

  getOrderTypeIcon(orderType: string): string {
    return orderType === 'group' ? '👥' : '👤';
  }

  getOrderTypeLabel(order: FoodOrder): string {
    if (order.orderType === 'group' && order.groupInfo) {
      return `Group Order (${order.groupInfo.totalUsers} people)`;
    }
    return 'Individual Order';
  }

  getAllItemThumbnails(order: FoodOrder): string[] {
    if (order.orderType === 'individual') {
      return order.items.slice(0, 4).map(item => item.image);
    } else if (order.orderType === 'group' && order.userOrders) {
      const allItems = order.userOrders.flatMap(userOrder => userOrder.items);
      const uniqueItems = allItems.filter((item, index, arr) => 
        arr.findIndex(i => i.image === item.image) === index
      );
      return uniqueItems.slice(0, 4).map(item => item.image);
    }
    return [];
  }

  getTotalUniqueItems(order: FoodOrder): number {
    if (order.orderType === 'individual') {
      return order.items.length;
    } else if (order.orderType === 'group' && order.userOrders) {
      const allItems = order.userOrders.flatMap(userOrder => userOrder.items);
      const uniqueItems = allItems.filter((item, index, arr) => 
        arr.findIndex(i => i.name === item.name) === index
      );
      return uniqueItems.length;
    }
    return 0;
  }
}
