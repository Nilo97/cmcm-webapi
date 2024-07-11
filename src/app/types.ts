export interface Product {
  id: number;
  name: string;
  code: number;
  description: string;
  price: number;
  quantity: number;
  categoryName: string;
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
