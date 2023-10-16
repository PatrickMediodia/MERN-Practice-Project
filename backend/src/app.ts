import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";

const app = express();

//sets up expres so that it accepts json bodies, lets us send json on POST
app.use(express.json());

//adds the notes router to the app
app.use("/api/notes", notesRoutes);

//this middleware is hit if the endpoint does not exist
app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});

//error handler has to take these 4 arguments
//middleware are checked in the order they are used, that is why get,post, update, delete etc. are used first
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";

    //checks if error is actually of type error
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    //internal server error
    res.status(500).json({ error : errorMessage});
});

export default app;