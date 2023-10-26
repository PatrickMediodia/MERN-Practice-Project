import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    //input in the enport and init is the HTTP request type
    const response = await fetch(input, init);

    //ok is a response between 200 to 300
    //if 400 to 500, it will return false
    if (response.ok) {
        return response;
    } else {
        //get the error body from the response as JSON
        const errorBody = await response.json();

        //get the error from body named error
        const errrorMessage = errorBody.error;

        throw Error(errrorMessage);
    }
}

/* all async functions must return a promise, it just syntactic sugar for promises */
/* all async returns are wrapped in promise */
export async function fetchNotes(): Promise<Note[]>{
    //fetch call to get notes
    const response = await fetchData("/api/notes", { method: "GET"});
    
    //parse response to json
    return await response.json();
}

export interface NoteInput {
    title: string,
    text?: string,
};

export async function createNote(note: NoteInput): Promise<Note> {
    // headers tell the backend what format our body is
    const response = await fetchData(
        "/api/notes", 
        { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(note),
        }
    );

    return response.json();
}

export async function deleteNote(noteId: string) {
    // headers tell the backend what format our body is
    await fetchData(
        "/api/notes/" + noteId,
        { method: "DELETE" },
    );
}