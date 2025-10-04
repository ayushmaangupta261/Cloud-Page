import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wand2, Loader2 } from "lucide-react";
import show from "../assets/dashboard/show.png";
import {
  getNotes,
  createNoteAPI,
  deleteNoteAPI,
  updateNoteAPI,
  shareNoteAPI,
  removeSharedUserAPI,
  getNoteSuggestionAPI
} from "../services/operations/notesApi";
import { FiShare2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  const [ownNotes, setOwnNotes] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [shareEmails, setShareEmails] = useState("");
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Fetch notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes(token);
        if (res.success) {
          setOwnNotes(res.ownNotes);
          setSharedNotes(res.sharedNotes);
        }
      } catch (error) {
        console.error("Failed to fetch notes: ", error);
      }
    };
    fetchNotes();
  }, [token]);

  // Create or Edit Note
  const handleSaveNote = async () => {
    try {
      if (!isEditingAllowed) return;

      if (selectedNote) {
        const res = await updateNoteAPI(
          selectedNote._id,
          { title: newNote.title, content: newNote.content },
          token
        );
        if (res.success) {
          setOwnNotes(prev => prev.map(n => n._id === selectedNote._id ? res.note : n));
          setSelectedNote(null);
          setNewNote({ title: "", content: "" });
          setIsModalOpen(false);
        }
      } else {
        const res = await createNoteAPI({ title: newNote.title, content: newNote.content }, token);
        if (res.success) {
          setOwnNotes(prev => [res.note, ...prev]);
          setNewNote({ title: "", content: "" });
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await deleteNoteAPI(noteId, token);
      if (res.success) {
        setOwnNotes(prev => prev.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setNewNote({ title: note.title, content: note.content });
    setIsEditingAllowed(true);
    setIsModalOpen(true);
  };

  const handleSharedNoteClick = (note: any) => {
    setSelectedNote(note);
    setNewNote({ title: note.title, content: note.content });
    setIsEditingAllowed(false);
    setIsModalOpen(true);
  };

  const handleShareClick = (note: any) => {
    setSelectedNote(note);
    setShareEmails("");
    setIsShareModalOpen(true);
  };

  // Share note (merge emails)
  const handleShareNote = async () => {
    try {
      const emails = shareEmails.split(",").map(e => e.trim()).filter(Boolean);
      if (emails.length === 0 && (!selectedNote.sharedWith || selectedNote.sharedWith.length === 0)) return;

      const res = await shareNoteAPI(selectedNote._id, emails, token);
      if (res.success) {
        const updatedSharedWith = Array.from(new Set([
          ...(selectedNote.sharedWith?.map((u: any) => u.email) || []),
          ...emails
        ]));

        setOwnNotes(prev => prev.map(n => n._id === selectedNote._id ? { ...n, sharedWith: updatedSharedWith.map(email => ({ email })) } : n));
        setSelectedNote((prev: any) => ({ ...prev, sharedWith: updatedSharedWith.map(email => ({ email })) }));
        setShareEmails("");
        setIsShareModalOpen(false);

      }
    } catch (error) {
      console.error("Failed to share note:", error);

    }
  };

  // Remove user access
  const handleRemoveSharedUser = async (email: string) => {
    try {
      const res = await removeSharedUserAPI(selectedNote._id, email, token);
      if (res.success) {
        const updatedSharedWith = selectedNote.sharedWith.filter((u: any) => u.email !== email);
        setOwnNotes(prev => prev.map(n => n._id === selectedNote._id ? { ...n, sharedWith: updatedSharedWith } : n));
        setSelectedNote((prev: any) => ({ ...prev, sharedWith: updatedSharedWith }));
        console.log(`Access removed for ${email}`);
      }
    } catch (error) {
      console.error("Failed to remove user access:", error);
      console.error("Failed to remove user access");
    }
  };

  // AI suggestion
  const handleGenerateAI = async () => {
    if (!newNote.content.trim()) return;
    setIsGeneratingAI(true);
    try {
      const suggestion = await getNoteSuggestionAPI(newNote.content, token);
      if (suggestion?.original && suggestion?.suggestions) {
        setNewNote({
          title: newNote.title,
          content: `${suggestion.original}\n\nSuggestions: ${suggestion.suggestions}`.trim()
        });
      }
    } catch (error) {
      console.error("Failed to generate AI suggestion:", error);
    } finally {
      setTimeout(() => setIsGeneratingAI(false), 3000);
    }
  };

  return (
    <div className="w-[80%] mx-auto flex flex-col gap-y-3 px-4 py-2 mt-[4rem]">
      {/* Welcome */}
      <div className="relative mt-6">
        <div className="absolute inset-0 bg-gray-400/50 rounded-lg blur-lg"></div>
        <div className="relative flex flex-col gap-y-3 px-4 py-4 rounded-lg shadow-md shadow-gray-400/50 bg-white">
          <p className="text-md md:text-3xl font-bold">Welcome, {user?.name}!</p>
          <p className="text-gray-500 text-sm md:text-xl">Email: {user?.email}</p>
          <p className="text-gray-500 text-sm md:text-xl">
            D.O.B: {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-gray-500 text-sm md:text-xl">Verified: {user?.isVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Create Note Button */}
      <div className="mt-2 h-auto w-full">
        <button
          onClick={() => { setSelectedNote(null); setNewNote({ title: "", content: "" }); setIsEditingAllowed(true); setIsModalOpen(true); }}
          className="px-4 py-2 bg-[#367AFF] w-full h-[3rem] text-white rounded-lg hover:bg-blue-600 transition">
          Create Note
        </button>
      </div>

      {/* Notes */}
      <div className="flex flex-col lg:flex-row gap-3 w-full py-4 mt-2">
        {/* Own Notes */}
        <div className="flex-1 px-2 pb-2 shadow-lg rounded-lg">
          <p className="text-base lg:text-lg font-semibold mb-2">Your Notes</p>
          {ownNotes.length === 0 ? (
            <p className="text-gray-500 text-sm lg:text-base">No notes yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[18rem] overflow-y-auto">
              {ownNotes.map(note => (
                <li key={note._id} className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm lg:text-base">
                  <span>{note.title}</span>
                  <div className="flex items-center gap-x-3 lg:gap-x-4">
                    <span className="text-xs lg:text-sm text-green-600">Owned</span>
                    <FiShare2 className="cursor-pointer text-blue-500" onClick={() => handleShareClick(note)} />
                    <FiTrash2 className="cursor-pointer text-red-500" onClick={() => handleDeleteNote(note._id)} />
                    <img src={show} alt="show" className="w-4 lg:w-5 cursor-pointer" onClick={() => handleNoteClick(note)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Shared Notes */}
        <div className="flex-1 px-2 pb-2 shadow-lg rounded-lg">
          <p className="text-base lg:text-lg font-semibold mb-2">Shared Notes</p>
          {sharedNotes.length === 0 ? (
            <p className="text-gray-500 text-sm lg:text-base">No shared notes.</p>
          ) : (
            <ul className="space-y-2 max-h-[18rem] overflow-y-auto">
              {sharedNotes.map(item => (
                <li
                  key={item._id}
                  className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer text-sm lg:text-base"
                  onClick={() => handleSharedNoteClick(item)}
                >
                  <span className="w-[10rem]">{item?.title}</span>
                  <span className="text-[0.8rem] text-end w-[90%] md:w-auto lg:text-sm text-purple-600">
                    Shared by {item.ownerName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create/Edit/View Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 ">
          <div className="bg-white p-4 rounded h-[60%] lg:h-[60%] w-[90%] lg:w-[60%] shadow-lg ">

            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border p-2 rounded mb-2"
              disabled={!isEditingAllowed}
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={e => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="w-full border p-2 rounded mb-2 h-32"
              disabled={!isEditingAllowed}
            />
            <div className="flex gap-x-4 justify-center lg:justify-end items-center mt-2">
              {/* Only owner can Save */}
              {isEditingAllowed && (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleSaveNote}
                  >
                    Save
                  </button>

                  {/* AI Suggest Button - only if content is not empty */}
                  {newNote.content.trim() && isEditingAllowed && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                      onClick={handleGenerateAI}
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                      AI
                    </button>
                  )}

                </>
              )}

              {/* Only non-owner can Close */}

              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}


      {/* Share Modal */}
      {isShareModalOpen && selectedNote && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded w-[90%] md:w-[40%] shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Share Note: {selectedNote.title}</h2>
            <div className="mb-2">
              <textarea
                placeholder="Enter emails to share (comma separated)"
                value={shareEmails}
                onChange={e => setShareEmails(e.target.value)}
                className="w-full border p-2 rounded h-20"
              />
            </div>
            <div className="mb-2">
              <p className="font-semibold">Currently Shared With:</p>
              <ul className="max-h-32 overflow-y-auto">
                {selectedNote.sharedWith?.map((user: any) => (
                  <li key={user.email} className="flex justify-between items-center p-1 border-b">
                    <span>{user.email}</span>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => handleRemoveSharedUser(user.email)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleShareNote}>
                Share
              </button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsShareModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
