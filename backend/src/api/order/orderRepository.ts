import type { Order } from '@/api/order/orderModel';

export const orders: Order[] = [
  {
    id: 1,
    tax: 399,
    shippingFee: 499,
    items: [
      {
        name: 'accent chair',
        price: 2599,
        image:
          'https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160',
        amount: 34,
        product: '6126ad3424d2bd09165a68c8',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    tax: 499,
    shippingFee: 799,
    items: [
      {
        name: 'bed',
        price: 2699,
        image:
          'https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160',
        amount: 3,
        product: '6126ad3424d2bd09165a68c7',
      },
      {
        name: 'chair',
        price: 2999,
        image:
          'https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160',
        amount: 2,
        product: '6126ad3424d2bd09165a68c4',
      },
    ],
    createdAt: new Date(),
  },
];

export class OrderRepository {
  async findAllAsync(): Promise<Order[]> {
    return orders;
  }

  async findByIdAsync(id: number): Promise<Order | null> {
    return orders.find(order => order.id === id) || null;
  }
}
