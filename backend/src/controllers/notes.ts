import { RequestHandler } from "express";
import NoteModel from "../models/note";

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
    const noteId = req.params.noteId
    
    try {
        const note = await NoteModel.findById(noteId).exec();
        res.status(200).json(note);
    } catch(error) {
        next(Error);
    }
};

//create note through request body
export const createNote: RequestHandler = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
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