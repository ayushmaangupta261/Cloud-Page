import { send } from "process";

const BASE_URL = (import.meta.env as any).VITE_APP_BASE_URL;



export const notesEnpoints = {
    create_notes: BASE_URL + "/api/notes/create-note",
    get_notes: BASE_URL + "/api/notes/get-notes",
    edit_note: BASE_URL + "/api/notes/edit-note",
    share_note: BASE_URL + "/api/notes/share-note",
    delete_note: BASE_URL + "/api/notes/delete-note",
    suggesstions_note: BASE_URL + "/api/notes/suggesstions",
    remove_shared_user_note: BASE_URL + "/api/notes/remove-user/:id"

};