export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imagesUrl: string[];
  quantity: number;
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export enum ProductCategories {
  TODOS = "",
  COZINHA = "cozinha",
  LAVANDERIA = "lavanderia",
  SALA = "sala",
  QUARTO = "quarto",
  BANHEIRO = "banheiro",
  DOAR = "donate",
}
