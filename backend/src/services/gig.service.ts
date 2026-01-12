import gigModel from "../models/gig.model";

interface CreateGigPayload {
    title: string;
    description: string;
    budget: number;
    ownerId: string;
  }

export class GigService {
  static async getAllGigs() {
    return await gigModel.find({});
  }

  static async createGig(data: CreateGigPayload) {
    const { title, description, budget, ownerId } = data;

    if (!title || !description || !budget) {
      throw {
        statusCode: 400,
        message: "Please enter the required fields to create gig",
      };
    }

    if (!ownerId) {
      throw {
        statusCode: 401,
        message: "Unauthorized User",
      };
    }

    const gig = await gigModel.create({
      title,
      description,
      budget,
      ownerId,
    });

    return gig;
  }
}
