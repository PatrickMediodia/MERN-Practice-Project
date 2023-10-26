//css module specific to note
import styles from "../styles/Note.module.css";
import { Card, CardFooter } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { create } from "domain";
import { formateDate } from "../utils/formatDate";

interface NoteProps {
    note : NoteModel,
    className?: string,
}

//store this component in the variable called Note
//this component is a function, in this case an arrow function
//this function accepts an argument of type NoteProps and destructure into a note

//whenever an argument in a component changes, it is like a state that when changed, the UI is going to rerender
const Note = ({ note, className } : NoteProps) => {
    //destructure note
    const { 
        _id, 
        title, 
        text,
        createdAt,
        updatedAt
    } = note;
    
    //use utils function to format date
    //this function is ran on every re-render
    //its ok becase this is cheap
    let createdUpdatedText : string;
    if (updatedAt > createdAt) {
        createdUpdatedText = `Updated: ${formateDate(updatedAt)}`;
    } else {
        createdUpdatedText = `Created: ${formateDate(createdAt)}`;
    }

    return (
        <Card className={`${styles.noteCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title>
                    { title }
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    { text }
                </Card.Text>
            </Card.Body>
            <CardFooter className="text-muted">
                {createdUpdatedText}
            </CardFooter>
        </Card>
    )
};

export default Note;