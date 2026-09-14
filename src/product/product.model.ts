export class ProductModel {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  credit: number;
  calculatedRating: number;
  ratingCount: number;
  advantages: string;
  disadvantages: string;
  categories: string[];
  tags: string;
  characteristics: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
}
