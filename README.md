# GigFlow

A simple freelance marketplace where clients can post jobs and freelancers can bid on them.

## Features

- **Post a Gig**: Clients can post new job opportunities with a title, description, and budget.
- **Browse Gigs**: Freelancers can see a feed of all available gigs.
- **Place Bids**: Freelancers can place bids on gigs they are interested in.
- **Real-time Bidding**: Gig owners receive instant notifications when a new bid is placed.
- **Hire Freelancers**: Gig owners can accept a bid to hire a freelancer for their project.
- **Real-time Hiring Updates**: Freelancers get an instant notification when they are hired for a gig.
- **Dashboard**: View all the gigs you've posted and all the bids you've made.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Real-time Communication**: Socket.IO

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a file named `.env` in the `backend` directory and add the following:

    ```env
    # The port your backend server will run on
    PORT=5050

    # Your MongoDB connection string
    DATABASE_URL=mongodb://localhost:27017/gigflow

    # A secret key for signing JWTs (choose a long, random string)
    JWT_SECRET=your-super-secret-key

    # The URL of your frontend application
    FRONTEND_URL=http://localhost:5173
    ```
    *Note: The default Vite port is `5173`. If you are using a different port, update `FRONTEND_URL`.*

4.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server should now be running on the port you specified (e.g., `http://localhost:5050`).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a file named `.env` in the `frontend` directory and add the following:

    ```env
    # The URL of your backend server
    VITE_BASE_URL=http://localhost:5050
    ```
    *Make sure this URL matches your backend server's address.*

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application should now be running in your browser (usually at `http://localhost:5173`).

That's it! You can now register a new account and start using the app.
