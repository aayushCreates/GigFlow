import gigModel from "../models/gig.model";

interface CreateGigPayload {
  title: string;
  description: string;
  budget: number;
  owner: string;
}

export class GigService {
  static async getAllGigs() {
    const gigs = await gigModel
      .find({})
      .populate("owner", "name email")
      .lean();

    return gigs.map((gig) => ({
      ...gig,
      owner: gig.owner,
      ownerId: gig.owner._id,
    }));
  }

  static async createGig(data: CreateGigPayload) {
    const { title, description, budget, owner } = data;

    if (!title || !budget) {
      throw {
        statusCode: 400,
        message: "Please enter the required fields to create gig",
      };
    }
    console.log("owner", owner);

    if (!owner) {
      throw {
        statusCode: 401,
        message: "Unauthorized User",
      };
    }

    const gig = await gigModel.create({
      title,
      description,
      budget,
      owner,
    });

    return gig;
  }
}
