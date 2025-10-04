import { apiConnector } from "../apiconnector";
import { notesEnpoints } from "../endpoints/notesEndpoints";
import toast from "react-hot-toast";

const { create_notes, get_notes, edit_note, share_note, delete_note, suggesstions_note, remove_shared_user_note } = notesEnpoints;


// create notes
export const createNoteAPI = async (data: { title: string; content: string }, token: string) => {

    const loadingToastId = toast.loading("Creating Note...");

    try {
        const response = await apiConnector("POST",
            create_notes, data,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        toast.success("Notes Created", { id: loadingToastId })
        return response;
    } catch (error) {
        console.error("Error creating note ->", error);

        toast.error("Error creating notes", { id: loadingToastId })
        return
    }
};


// get notes
export const getNotes = async (token: string) => {

    const loadingToastId = toast.loading("Getting Note...");

    try {
        const response = await apiConnector("GET", get_notes, null, {
            Authorization: `Bearer ${token}`,
        });
        console.log("getNotes response ->", response);

        toast.success("Fetched Notes", { id: loadingToastId })
        return response;
    } catch (error) {
        console.error("Error fetching notes ->", error);
        toast.error("Errot Fetching Notes", { id: loadingToastId })
        return;
    }
};


// Edit Note
export const updateNoteAPI = async (noteId: string, data: { title: string; content: string }, token: string) => {
    const loadingToastId = toast.loading("Updating Note...");

    try {
        const response = await apiConnector("PUT", `${edit_note}/${noteId}`, data, {
            Authorization: `Bearer ${token}`,
        });

        toast.success("Note Updated", { id: loadingToastId });
        return response;
    } catch (error) {
        console.error("Error updating note ->", error);
        toast.error("Error updating note", { id: loadingToastId });
        return;
    }
};

// Delete Note
export const deleteNoteAPI = async (noteId: string, token: string) => {
    const loadingToastId = toast.loading("Deleting Note...");

    try {
        console.log("Delete api -> ", noteId);

        const response = await apiConnector("DELETE", `${delete_note}/${noteId}`, null, {
            Authorization: `Bearer ${token}`,
        });

        toast.success("Note Deleted", { id: loadingToastId });
        return response;
    } catch (error: any) {
        console.error("Error deleting note ->", error);
        toast.error(error.response.data.message || "Error deleting note", { id: loadingToastId });
        return;
    }
};

// Share Note
export const shareNoteAPI = async (noteId: string, emails: string[], token: string) => {
    const loadingToastId = toast.loading("Sharing Note...");

    try {
        const response = await apiConnector("POST", `${share_note}/${noteId}`, { emails }, {
            Authorization: `Bearer ${token}`,
        });

        toast.success("Note Shared Sucessfully", { id: loadingToastId });
        return response;
    } catch (error: any) {
        console.error("Error sharing note ->", error);
        toast.error(error.response.data.message || "Error sharing note", { id: loadingToastId });
        return;
    }
};



// Get Note Suggestion by passing note content
export const getNoteSuggestionAPI = async (content: string, token: string) => {
    const loadingToastId = toast.loading("Generating suggestion...");

    try {
        const response = await apiConnector(
            "POST",
            suggesstions_note, // your backend endpoint
            { message: content },       // send note content in body
            {
                Authorization: `Bearer ${token}`,
            }
        );

        console.log("Response from ai -> ", response);

        toast.success("Suggestion generated", { id: loadingToastId });
        return response; // response.data should have the suggested note
    } catch (error: any) {
        console.error("Error generating note suggestion ->", error);
        toast.error(error.response?.data?.message || "Error generating suggestion", { id: loadingToastId });
        return null;
    }
};



export const removeSharedUserAPI = async (noteId: string, email: string, token: string) => {
    const loadingToastId = toast.loading(`Removing access for ${email}...`);

    try {
        // Replace :id in the endpoint with actual noteId
        const url = notesEnpoints.remove_shared_user_note.replace(":id", noteId);

        const response = await apiConnector(
            "PUT",
            url,
            { email }, // request body
            {
                Authorization: `Bearer ${token}`,
            }
        );

        toast.success(`Access removed for ${email}`, { id: loadingToastId });
        return response; // should have { success, message }
    } catch (error: any) {
        console.error("Error removing shared user ->", error);
        toast.error(error.response?.data?.message || "Failed to remove access", { id: loadingToastId });
        return { success: false, message: error.response?.data?.message || "Failed to remove access" };
    }
};