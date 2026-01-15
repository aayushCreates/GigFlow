import { Types } from "mongoose";


export enum BidStatus {
    pending = "pending",
    hired = "hired",
    rejected = "rejected"
}

export interface Bid {
    gigId: Types.ObjectId;
    freelancer: Types.ObjectId;
    message?: string;
    price: number;
    status: BidStatus;
}
