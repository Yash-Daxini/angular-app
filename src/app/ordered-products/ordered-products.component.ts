import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  userRating: number;
  totalRatings: number;
  feedback: string;
  orderCount: number;
  lastOrdered: Date;
}

@Component({
  selector: 'app-ordered-products',
  templateUrl: './ordered-products.component.html',
  styleUrls: ['./ordered-products.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OrderedProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
      price: 12.99,
      category: 'Pizza',
      rating: 4.5,
      userRating: 0,
      totalRatings: 128,
      feedback: '',
      orderCount: 15,
      lastOrdered: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken breast with lettuce, tomato, and special sauce',
      price: 9.99,
      category: 'Burgers',
      rating: 4.2,
      userRating: 0,
      totalRatings: 89,
      feedback: '',
      orderCount: 12,
      lastOrdered: new Date('2024-01-10')
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
      price: 8.99,
      category: 'Salads',
      rating: 4.0,
      userRating: 0,
      totalRatings: 45,
      feedback: '',
      orderCount: 8,
      lastOrdered: new Date('2024-01-12')
    },
    {
      id: 4,
      name: 'Spaghetti Carbonara',
      description: 'Traditional Italian pasta with eggs, cheese, pancetta, and black pepper',
      price: 14.99,
      category: 'Pasta',
      rating: 4.7,
      userRating: 0,
      totalRatings: 167,
      feedback: '',
      orderCount: 20,
      lastOrdered: new Date('2024-01-18')
    },
    {
      id: 5,
      name: 'Fish & Chips',
      description: 'Beer-battered cod with crispy fries and mushy peas',
      price: 11.99,
      category: 'Seafood',
      rating: 4.3,
      userRating: 0,
      totalRatings: 76,
      feedback: '',
      orderCount: 10,
      lastOrdered: new Date('2024-01-08')
    },
    {
      id: 6,
      name: 'Chocolate Cake',
      description: 'Rich, moist chocolate cake with chocolate frosting',
      price: 6.99,
      category: 'Desserts',
      rating: 4.8,
      userRating: 0,
      totalRatings: 203,
      feedback: '',
      orderCount: 25,
      lastOrdered: new Date('2024-01-20')
    },
    {
      id: 7,
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni pizza with mozzarella cheese and tomato sauce',
      price: 13.99,
      category: 'Pizza',
      rating: 4.4,
      userRating: 0,
      totalRatings: 156,
      feedback: '',
      orderCount: 18,
      lastOrdered: new Date('2024-01-14')
    },
    {
      id: 8,
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection with lemon herbs',
      price: 18.99,
      category: 'Seafood',
      rating: 4.6,
      userRating: 0,
      totalRatings: 92,
      feedback: '',
      orderCount: 14,
      lastOrdered: new Date('2024-01-16')
    }
  ];

  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  categories: string[] = ['all'];
  sortBy: string = 'name';
  sortOrder: string = 'asc';
  expandedRows: Set<number> = new Set();

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
    this.extractCategories();
    this.sortProducts();
  }

  extractCategories(): void {
    const uniqueCategories = [...new Set(this.products.map(p => p.category))];
    this.categories = ['all', ...uniqueCategories];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      let aValue = a[this.sortBy as keyof Product];
      let bValue = b[this.sortBy as keyof Product];

      if (this.sortBy === 'lastOrdered') {
        aValue = new Date(aValue as Date).getTime();
        bValue = new Date(bValue as Date).getTime();
      }

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.sortProducts();
  }

  toggleRow(productId: number): void {
    if (this.expandedRows.has(productId)) {
      this.expandedRows.delete(productId);
    } else {
      this.expandedRows.add(productId);
    }
  }

  isRowExpanded(productId: number): boolean {
    return this.expandedRows.has(productId);
  }

  setRating(product: Product, rating: number): void {
    product.userRating = rating;
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  submitRating(product: Product): void {
    if (product.userRating > 0) {
      const totalScore = (product.rating * product.totalRatings) + product.userRating;
      product.totalRatings++;
      product.rating = totalScore / product.totalRatings;

      alert(`Thank you for rating ${product.name}!`);
    } else {
      alert('Please select a rating first.');
    }
  }

  submitFeedback(product: Product): void {
    if (product.feedback.trim()) {
      alert(`Thank you for your feedback on ${product.name}!`);
      console.log(`Feedback for ${product.name}: ${product.feedback}`);
    } else {
      alert('Please enter your feedback first.');
    }
  }

  getRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Below Average';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Pizza': 'fas fa-pizza-slice',
      'Burgers': 'fas fa-hamburger',
      'Salads': 'fas fa-leaf',
      'Pasta': 'fas fa-utensils',
      'Seafood': 'fas fa-fish',
      'Desserts': 'fas fa-birthday-cake'
    };
    return icons[category] || 'fas fa-utensils';
  }

  getRatingClass(rating: number): string {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 4.0) return 'very-good';
    if (rating >= 3.5) return 'good';
    if (rating >= 3.0) return 'average';
    return 'poor';
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
}