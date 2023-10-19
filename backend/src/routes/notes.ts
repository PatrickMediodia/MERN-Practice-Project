import * as NotesController from "../controllers/notes";
import express from "express";

//https://expressjs.com/en/guide/routing.html
const router = express.Router();

//concatenated after /api/notes found in app.use in app.ts file
router.get("/", NotesController.getNotes);

//the number put after the / will be read and that specific node will be found
router.get("/:noteId", NotesController.getNote);

//possible same address as they have different HTTP requests
router.post("/", NotesController.createNote);

export default router;