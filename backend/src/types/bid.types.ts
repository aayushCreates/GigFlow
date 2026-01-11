import { Types } from "mongoose";


export interface Bid {
    gigId: Types.ObjectId;
    freelancerId: Types.ObjectId;
    message?: string;
    price: number;
    status: "pending" | "hired" | "rejected";
}
