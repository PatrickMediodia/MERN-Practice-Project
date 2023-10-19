//css module specific to note
import styles from "../styles/Note.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";

interface NoteProps {
    note : NoteModel,
}

//store this component in the variable called Note
//this component is a function, in this case an arrow function
//this function accepts an argument of type NoteProps and destructure into a note

//whenever an argument in a component changes, it is like a state that when changed, the UI is going to rerender
const Note = ({ note } : NoteProps) => {
    //destructure note
    const { 
        _id, 
        title, 
        text,
        createdAt,
        updatedAt
    } = note;
    
    return (
        <Card className={styles.noteCard}>
            <Card.Body>
                <Card.Title>
                    { title }
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    { text }
                </Card.Text>
            </Card.Body>
        </Card>
    )
};

export default Note;