import { Router } from "express";
import { createNote, getNotes, deleteNote, shareNote, editNote , removeSharedUser} from "../controllers/noteController";
import { authMiddleware } from "../middlewares/authMiddleware";

import { rewriteMessage } from "../controllers/genAiController";

const router = Router();


router.post("/create-note", authMiddleware, createNote);

router.get("/get-notes", authMiddleware, getNotes);

router.delete("/delete-note/:id", authMiddleware, deleteNote);

router.put("/edit-note/:id", authMiddleware, editNote);

router.post("/share-note/:id", authMiddleware, shareNote);

router.post("/suggesstions", authMiddleware, rewriteMessage);

router.put("/remove-user/:id", authMiddleware, removeSharedUser);

export default router;
