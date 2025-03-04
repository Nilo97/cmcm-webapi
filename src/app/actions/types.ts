export interface BatchResponse {
  customerName: string;
  entryDate: string;
  expirationDate: string;
  quantity: number;
  price: number;
  associatedCosts: number;
}

export interface Book {
  id: string;
  registrationNumber: string;
  brand: Brand;
  model: string;
  manufactureYear: number;
  bicycleType: BicycleType;
  engineNumber: string;
  engineCapacity: string; // BigDecimal converted to string
  frameNumber: string;
  observations: string;
  customerName: string;
  invoice:string;
  color:string;
  circulation:string;
}


export interface Licence {
  id: string;
  licenceNumber: string;
  registrationNumber: string;
  brand: Brand;
  model: string;
  manufactureYear: number;
  bicycleType: BicycleType;
  engineNumber: string;
  engineCapacity: string; // BigDecimal converted to string
  frameNumber: string;
  observations: string;
  customerName: string;
  invoice:string;
  color:string;
  circulation:string;
}


// Enum for Brand (if needed)
export enum Brand {
  HONDA = "HONDA",
  YAMAHA = "YAMAHA",
  HARLEY_DAVIDSON = "HARLEY_DAVIDSON",
  SUZUKI = "SUZUKI",
  KAWASAKI = "KAWASAKI",
  TOYOTA = "TOYOTA",
  BMW = "BMW",
}

// Enum for BicycleType (if needed)
export enum BicycleType {
  ROAD = "ROAD",
  MOUNTAIN = "MOUNTAIN",
  HYBRID = "HYBRID",
}

export interface customer {
  id: string;
  name: string;
  documentNumber: string;
  address: string;
  phoneNumber: string;
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
  customers: number;
};

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

export enum CashFlowStatus {
  OPENED,
  CLOSED,
}

export interface CashFlowResponse {
  id: string;
  openingBalance: number;
  totalAmount: number;
  openingTime: string;
  closingTime: string;
  userName: string;
  status: string;
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  tax?: string;
  batchId?: string;
};

export type ProductOption = {
  value: string;
  label: JSX.Element;
  product: any;
};

export interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  sync: boolean;
}

export interface BrandResponse {
  id: string;
  description: string;
}

export enum CustomerType {
  SINGULAR,
  COMPANY,
  VIP,
  PARTNER,
}

export interface InvoiceResponse {
  id: string;
  paymentTerms: string;
  sync: boolean;
  paymentStatus: string;
  documentDate: string;
  createdAt: string;
  dueDate: string;
  customer: string;
  discount: number;
  tax: number;
  total: number;
  reference: string;
  docId: string;
}

export interface ReceiptResponse {
  id: string;
  sync: boolean;
  createdAt: string;
  customer: string;
  discount: number;
  tax: number;
  total: number;
  reference: string;
}
