import { Types } from "mongoose";
import { Bid } from "./bid.types";


export enum GigStatus {
  open = "open",
  assigned = "assigned"
}

export interface Gig {
  title: string;
  description?: string;
  budget: number;
  owner: Types.ObjectId;
  status: GigStatus;
  bids?: Bid[];
}