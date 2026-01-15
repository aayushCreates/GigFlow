import type { Bid } from "./bid.types";

export enum GigStatus {
  open = "open", 
  assigned = "assigned", 
  completed = "completed", 
  cancelled = "cancelled"
}

export interface Gig {
  _id?: string;
  title: string;
  description?: string;
  budget: number;
  status: GigStatus;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
  bids?: Bid[];
  ownerId?: string;
  createdAt?: string;
}
