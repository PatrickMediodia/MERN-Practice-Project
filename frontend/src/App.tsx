import React, { useEffect, useState } from 'react';
import './styles/global.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesAPI from './network/notes_api';
import AddNoteDialog from './components/AddNoteDialog';

function App() {
  //[variable, function to change this variable], array destructuring
  //set initial clickCount state to empty list
  //always do this before the return function
  const[notes, setNotes] = useState<NoteModel[]>([]);

  //state so that we know if we should show or hide the modal
  const[showAddNoteDialog, setShowAddNoteDialog] = useState<boolean>(false);

  //execute side effects outside of rendering
  useEffect(() => {

    //use effect cannot take async functions
    //so you add another function inside of it
    async function loadNotes() {
      try {
        //get the notes from the wrapped fetch call
        const notes = await NotesAPI.fetchNotes();
        
        //update the notes state
        setNotes(notes);

      } catch(error) {
        console.log(error);
        alert(error);
      };
    }

    loadNotes();

    //make sure to pass a dependency array
    //in this case it will only run once
    //if you put variable to check here and hte variable value changes, it will trigger this useEffect
  }, []);

  return (
    <Container>
      <Button
        className={`mb-4 ${styleUtils.blockCenter}`}
        onClick={()=> setShowAddNoteDialog(true)} >
        Add new note
      </Button>

      <Row xs={1} md={2} xl={3} className="g-4">
        {
          notes.map(note=> (
            <Col key={note._id}>
              <Note note={note}  className={styles.note}/>
            </Col>
          ))
        }
      </Row>

      {
        //like a ternary operator, only show AddNoteDIalog if it is true
        //state is not passed as a prop because its state when closed will be retained
        // for example if they closed it, its contents will stay
        //in the current configuration it will clear the state altogether

        showAddNoteDialog && 
        <AddNoteDialog 
          onDismiss={ ()=> setShowAddNoteDialog(false) }
          onNoteSaved={ (newNote) => {
            /* ...notes is the spread function */
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          } }
        />
        
        //onDismiss as a prop drills down the setShowAddNoteDialog to be executed onHide
      }

    </Container>
  );
}

export default App;