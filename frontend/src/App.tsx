import React, { useEffect, useState } from 'react';
import './styles/global.css';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesAPI from './network/notes_api';
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa"

function App() {
	//[variable, function to change this variable], array destructuring
	//set initial clickCount state to empty list
	//always do this before the return function
	const [notes, setNotes] = useState<NoteModel[]>([]);
	
	//states for the loading 
	const [notesLoading, setNotesLoading] = useState<boolean>(true);
	const [showNotesLoadingErorr, setShowNotesLoadingErorr] = useState<boolean>(false);

	//state so that we know if we should show or hide the modal
	const [showAddNoteDialog, setShowAddNoteDialog] = useState<boolean>(false);

	//keeps track of which note to edit when clicked
	const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

	//execute side effects outside of rendering
	useEffect(() => {

		//use effect cannot take async functions
		//so you add another function inside of it
		async function loadNotes() {
			try {
				//show loading indicator
				setShowNotesLoadingErorr(false);
				setNotesLoading(true);

				//get the notes from the wrapped fetch call
				const notes = await NotesAPI.fetchNotes();
				
				//update the notes state
				setNotes(notes);
			} catch(error) {
				console.log(error);
				setShowNotesLoadingErorr(true);
			} finally {
				//hide loading indicator
				setNotesLoading(false);
			};
		}

		loadNotes();

		//make sure to pass a dependency array
		//in this case it will only run once
		//if you put variable to check here and hte variable value changes, it will trigger this useEffect
	}, []); 

	async function deleteNote(note: NoteModel) {
		try {
			//call the delete function in network notes_api
			await NotesAPI.deleteNote(note._id);
			
			//filter the notes to check if id of note is id to not include
			setNotes(notes.filter(existingNote => existingNote._id !== note._id));
		} catch (error) {
			console.log(error);
		alert(error);
		}
	}

	const notesGrid = 
		<Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
			{
				notes.map(note=> (
					<Col key={note._id}>
					<Note 
						note={note} 
						onNoteClicked={setNoteToEdit} 
						className={styles.note}
						onDeleteNoteClicked={deleteNote}
					/>
					</Col>
				))
			}
		</Row>

	return (
		<Container className={styles.notePage}>
			<Button
				className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
				onClick={()=> setShowAddNoteDialog(true)} >
				<FaPlus />
				Add new note
			</Button>

			{/* show loading indicator if notes loading is true */ }
			{ notesLoading && <Spinner animation='border' variant='primary' /> }

			{/* show the paragraph tag if showNotesLoading error is true */ }
			{ showNotesLoadingErorr && <p>Something went wrong. Please refresh the page.</p> }

			{/* if length of notes state is not zero, show grid, else show message */}
			{ !notesLoading && !showNotesLoadingErorr &&
				<>
					{ notes.length > 0 ? notesGrid : <p>You don't have any notes yet</p> }
				</>
			}

			{
				//like a ternary operator, only show AddNoteDIalog if it is true
				//state is not passed as a prop because its state when closed will be retained
				// for example if they closed it, its contents will stay
				//in the current configuration it will clear the state altogether
				showAddNoteDialog && 
				<AddEditNoteDialog 
					onDismiss={ ()=> setShowAddNoteDialog(false) }
					onNoteSaved={ (newNote) => {
						/* ...notes is the spread function */
						setNotes([...notes, newNote]);
						setShowAddNoteDialog(false);
					}
					}
				/>
				//onDismiss as a prop drills down the setShowAddNoteDialog to be executed onHide
			}

			{
				noteToEdit &&
				<AddEditNoteDialog
					onDismiss={ ()=> setNoteToEdit(null) }
					noteToEdit={noteToEdit}
					onNoteSaved={ (updatedNote) => {
						/* check if note is the same id as updated note, if same, use the updated note instead */
						setNotes(
							notes.map(note =>
								note._id === updatedNote._id 
								? updatedNote
								: note
							)
						);
						setNoteToEdit(null);
						}
					}
				/>
			}
		</Container>
	);
}

export default App;