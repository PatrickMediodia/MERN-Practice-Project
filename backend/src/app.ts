import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import NoteModel from "./models/note";

const app = express();

//express infers that req and res that why no need to declare even though using TS
//no need to use try catch if it is synchronous/non-async code
app.get("/", async (req, res, next) => {
    try {
        //throw Error("This is a new error!");
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch(error) {
        next(error)
    }
});

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