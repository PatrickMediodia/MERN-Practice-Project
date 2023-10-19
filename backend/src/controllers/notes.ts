import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

//express infers that req and res from type RequestHandler
//no need to use try catch if it is synchronous/non-async code
export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch(error) {
        next(error);
    }
};

//get specific note by id
export const getNote: RequestHandler =async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        //check if the noteId passed adheres to mongoose id rules
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        //check if note is null or undefined
        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        res.status(200).json(note);
    } catch(error) {
        next(Error);
    }
};

interface CreateNoteBody {
    title?: string,
    text?: string
}

//create note through request body
//RequestHandler<params, request body, response body, response query>
//unknown is restrictive while any is not
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        //title is false if it is undefined
        //response code 400 means bad request, which may mean an argumen is missing
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            title: title,
            text: text
        });
        
        //201 - new resource created
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

//must have the same name put in the URL
interface UpdateNoteParams {
    noteId: string
}

//title and text can be optional
interface UpdateNoteBody {
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        //set the new values to the note after checks
        note.title = newTitle;
        note.text = newText;
        
        //return the updated and saved note back to the user
        const updatedNote = await note.save();
        
        res.status(200).json(updatedNote);

        //another approach is NoteModel.findByIdAndUpdate()
        //the problem is that you will need to lookup the note again after
    } catch(error) {
        next(error);
    }
}

export const deleteNote: RequestHandler = async(req, res, next) => {
    const noteId = req.params.noteId;
    
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        
        //remove can no longer be used
        //see https://stackoverflow.com/questions/75689772/error-ts2339-property-remove-does-not-exist-on-type-documentunknown
        await note.deleteOne();
        
        //204 means deletion successful
        //status does not send a response, it is json the one sending
        //to send a status, use the sendStatus method
        res.sendStatus(204);
    } catch(error) {
        next(error)
    }
};