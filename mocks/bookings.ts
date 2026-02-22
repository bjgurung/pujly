export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  panditId: string;
  panditName: string;
  panditImageUrl: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  price: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
}
