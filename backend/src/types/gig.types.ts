import { Types } from "mongoose";


export interface Gig {
  title: string;
  description?: string;
  budget: number;
  ownerId: Types.ObjectId;
  status: "open" | "assigned";
}