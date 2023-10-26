import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './styles/global.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";

function App() {
  //[variable, function to change this variable], array destructuring
  //set initial clickCount state to empty list
  //always do this before the return function
  const[notes, setNotes] = useState<NoteModel[]>([]);

  //execute side effects outside of rendering
  useEffect(() => {

    //use effect cannot take async functions
    //so you add another function inside of it
    async function loadNotes() {
      try {

        //fetch call to get notes
        const response = await fetch("/api/notes", { method: "GET"});

        //parse response to json
        const notes = await response.json();
        
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
      <Row xs={1} md={2} xl={3} className="g-4">
      {
        notes.map(note=> (
          <Col key={note._id}>
            <Note note={note}  className={styles.note}/>
          </Col>
        ))
      }
      </Row>
    </Container>
  );
}

export default App;