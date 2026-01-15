export enum BidStatus {
  pending = "pending",
  hired = "hired",
  rejected = "rejected",
}

export interface Bid {
  _id: string;
  gigId: string;
  price: number;
  message?: string;
  status: BidStatus;
  freelancer: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}
