export interface BatchResponse {
  supplierName: string;
  entryDate: string;
  expirationDate: string;
  quantity: number;
  price: number;
}

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
  minimumQuantity: number;
  expirationDate: string;
  perishable: boolean;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: number;
  NUIT: number;
  plan: string;
  invoice: string | null;
  quotation: string | null;
  logo: string | null;
  users: User[];
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

export interface User {
  id: string;
  name: string;
  contactInfo: string;
  username: string;
  email: string;
}

export type GeneralStats = {
  products: number;
  categories: number;
  suppliers: number;
};

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

export interface YearMonthStatCountResponse {
  year: number;
  month: number;
  count: number;
}

export interface StatsResponse {
  entries: YearMonthStatCountResponse[];
  sales: YearMonthStatCountResponse[];
}

export type Plan = "OFFLINE" | "ONLINE" | "COMPLETE";

export interface CompanyResponse {
  id: string;
  logo: string;
  name: string;
  address: string;
  email: string;
  phone: number;
  NUIT: number;
  plan: Plan;
  invoice: string;
  quotation: string;
}
