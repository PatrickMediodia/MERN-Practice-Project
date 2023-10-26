import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesAPI from "../network/notes_api";

interface AddNoteDialogProps {
    onDismiss: () => void,
    onNoteSaved: (note : Note) => void,
}

const AddNoteDialog = ({ onDismiss, onNoteSaved } : AddNoteDialogProps) => {

    const {
        register,
        handleSubmit,
        formState : {
            errors,
            isSubmitting,
        }
    } = useForm<NoteInput>();

    async function onSubmit(input: NoteInput) {
        try {
            //call the Notes API create methode
            const noteResponse = await NotesAPI.createNote(input);

            //save the rresponse of the new note to add it to the UI
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
                    Add Note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
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

                    form="addNoteForm"

                    /* disable the button if the form is submitting */
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddNoteDialog;