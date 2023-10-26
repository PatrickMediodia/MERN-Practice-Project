import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesAPI from "../network/notes_api";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note : Note) => void,
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved } : AddEditNoteDialogProps) => {

    const {
        register,
        handleSubmit,
        formState : {
            errors,
            isSubmitting,
        }
    } = useForm<NoteInput>({
        // set default values
        // if noteToEdit is not undefined, it will use those values
        defaultValues : {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
        }
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;

            //check if noteToEdit has been passed as props and is not undefined
            //if not undefined, you know it is update note
            if (noteToEdit) {
                noteResponse = await NotesAPI.updatedNote(noteToEdit._id, input);

            //if undefined, you know it is a create note
            } else {
                //call the Notes API create method
                noteResponse = await NotesAPI.createNote(input);
            }

            //save the response of the new note to add it to the UI
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        //onHide callback is called when you click the close button or click outside of the dialog
        //same effect as passing () => onDismiss();
        //activates the drilled down function to close the dialog
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    { noteToEdit ? "Update" : "Add" } Note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            isInvalid={errors.title === undefined ? true : false}
                            {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                //only show the message if title is not available
                                //set through isInvalid property on Form.Control  v
                                errors.title?.message 
                            }
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Text"
                            {...register("text")}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"

                    /* since it is not in the form it is not connected by default */
                    /* set the form property to the id of the form*/

                    form="addEditNoteForm"

                    /* disable the button if the form is submitting */
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditNoteDialog;