import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import User, { IUser } from "../models/User"; // assuming you have a User model


interface AuthRequest extends Request {
  user?: IUser;
}

// Create a new note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, } = req.body;
    const user = req.user;



    // Create the note
    const note = await Note.create({
      title,
      content,
      user: user?._id,
    });


    // Push note ID into user's notes array
    await User.findByIdAndUpdate(req.user!._id, {
      $push: { notes: note._id },
      new: true
    });

    res.status(201).json({ success: true, note });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};


// Get all notes for a user (own + shared) separately
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    // Find user and populate own notes and shared notes
    const user = await User.findById(userId)
      .populate({
        path: "notes", // user's own notes
        populate: { path: "sharedWith", select: "email name" } // populate sharedWith users
      })
      .populate({
        path: "sharedNotes", // notes shared with the user
        populate: [
          { path: "user", select: "name email" }, // owner info
          { path: "sharedWith", select: "email name" } // users shared with
        ]
      })
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Map own notes
    const ownNotes = (user.notes as any[]).map(note => ({
      _id: note._id,
      title: note.title,
      content: note.content,
      sharedWith: note.sharedWith?.map((u: any) => ({ name: u.name, email: u.email })) || [],
      isOwner: true,
    }));

    // Map shared notes
    const sharedNotes = (user.sharedNotes as any[]).map(note => ({
      _id: note._id,
      title: note.title,
      content: note.content,
      ownerName: note.user?.name || "Unknown",
      sharedWith: note.sharedWith?.map((u: any) => ({ name: u.name, email: u.email })) || [],
      isOwner: false,
    }));

    res.json({
      success: true,
      ownNotes,
      sharedNotes,
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};




// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response) => {

  const noteId = req.params.id;
  const userId = req.user!._id; //  user in req from auth middleware


  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can delete
    if (note.user.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    // Remove note from owner's notes
    await User.findByIdAndUpdate(userId, { $pull: { notes: note._id } });

    // Remove note from all shared users
    if (note.sharedWith && note.sharedWith.length > 0) {
      await User.updateMany(
        { email: { $in: note.sharedWith } }, // find all users the note was shared with
        { $pull: { sharedNotes: note._id } } // remove note reference
      );
    }

    // Delete the note itself
    await note.deleteOne();

    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Note Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Share a note with another user via email
export const shareNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = req.params.id;
    const { emails } = req.body;

    if (!emails)
      return res.status(400).json({ success: false, message: "No emails provided" });

    // Convert emails to array
    const emailList: string[] = Array.isArray(emails)
      ? emails.map(e => e.trim()).filter(Boolean)
      : emails.split(",").map((e: string) => e.trim()).filter(Boolean);

    if (emailList.length === 0)
      return res.status(400).json({ success: false, message: "No valid emails provided" });

    // Find note
    const note = await Note.findById(noteId).populate<{ user: IUser }>("user");
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can share
    if (note.user._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to share this note" });
    }

    // Find users by email
    const users = await User.find({ email: { $in: emailList } });
    const foundUsers = users.map(u => u._id);
    const foundEmails = users.map(u => u.email);
    const notFoundEmails = emailList.filter(e => !foundEmails.includes(e));

    if (foundUsers.length === 0) {
      return res.status(404).json({ success: false, message: "No valid users found", notFoundEmails });
    }

    // Update note.sharedWith with user IDs, avoiding duplicates
    note.sharedWith = Array.from(new Set([...(note.sharedWith || []), ...foundUsers]));
    await note.save();

    // Update each user's sharedNotes
    for (const u of users) {
      if (!Array.isArray(u.sharedNotes)) u.sharedNotes = [];
      if (!u.sharedNotes.includes(note._id)) {
        u.sharedNotes.push(note._id);
        await u.save();
      }
    }

   

    // Return note with user names and emails shared with
    const sharedWithUsers = await User.find({ _id: { $in: note.sharedWith } }).select("name email");

    res.json({
      success: true,
      message: "Note shared successfully",
      sharedWith: sharedWithUsers, // [{name, email}, ...]
      notFoundEmails
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



// editthe note
export const editNote = async (req: AuthRequest, res: Response) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user!._id; // assuming you have user in req from auth middleware

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only owner can edit
    if (note.user.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export const removeSharedUser = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = req.params.id;
    const { email } = req.body;

    const note = await Note.findById(noteId).populate("user sharedWith");
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.user._id.toString() !== req.user!._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    const userToRemove = await User.findOne({ email });
    if (!userToRemove) return res.status(404).json({ success: false, message: "User not found" });

    // Remove user from note
    note.sharedWith = note.sharedWith.filter((u: any) => u._id.toString() !== userToRemove._id.toString());
    await note.save();

    // Remove note from user's sharedNotes
    userToRemove.sharedNotes = userToRemove.sharedNotes.filter((nId: any) => nId.toString() !== note._id.toString());
    await userToRemove.save();

    res.json({ success: true, message: "User access removed successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
