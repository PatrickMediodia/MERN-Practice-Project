import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

//logs of the enpoints that we access; dev environment
app.use(morgan("dev"));

//sets up expres so that it accepts json bodies, lets us send json on POST
app.use(express.json());

//adds the notes router to the app
app.use("/api/notes", notesRoutes);

//this middleware is hit if the endpoint does not exist
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

//error handler has to take these 4 arguments
//middleware are checked in the order they are used, that is why get,post, update, delete etc. are used first
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;

    //checks if error is actually of type http error
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }

    //internal server error
    res.status(statusCode).json({ error : errorMessage});
});
    
export default app;