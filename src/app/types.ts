export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  quantity: number;
  categoryName: string;
  categoryId: string;
  initialQuantity: number;
  expirationDate: string;
  perishable: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactInfo: string;
}



export interface PaginatedProducts {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Product[];
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}
