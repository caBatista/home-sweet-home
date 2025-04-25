export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Donation {
  id: string;
  amount: number;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export enum ProductCategories {
  TODOS = "",
  ELETROS = "eletro",
  LIMPEZA = "limpeza",
  LOUÇA = "louca",
  MOVEIS = "movel",
  DOAR = "donate",
}
