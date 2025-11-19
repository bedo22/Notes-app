import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {AddNoteForm} from "../components/AddNoteForm";
import FolderList from "../components/FolderList";
import { supabase } from "../lib/supabaseClient";
import type { Note } from "../types/note";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Search, FileText } from "lucide-react";

const NoteList = () =>{
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchNotes = async (folderId?: string | null) => {
    let query = supabase.from("notes").select("*").order("created_at", { ascending: false });
    if (folderId === null) {
      // "All / Uncategorized": show all notes (or decide to show only folderless notes)
      // If you want only folderless notes: uncomment next line and comment out the query without `.or(...)`
      // query = supabase.from("notes").select("*").is("folder_id", null).order(...);
    } else if (folderId) {
      query = supabase.from("notes").select("*").eq("folder_id", folderId).order("created_at", { ascending: false });
    } // else (no folderId) keep the default: fetch all notes
    const { data, error } = await query;
    if (error) console.error(error);
    setNotes(data || []);
    };

    // Filter notes based on search query
    const filteredNotes = notes.filter(
        (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {    
        fetchNotes(selectedFolderId)
    }, [selectedFolderId])
    return(
    <div className="flex h-[calc(100vh-64px)]">
      <FolderList
        onSelectFolder={setSelectedFolderId}
        selectedFolderId={selectedFolderId}
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">My Notes</h1>
            <AddNoteForm
              onNoteAdded={fetchNotes}
              selectedFolderId={selectedFolderId}
            />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Empty State */}
          {filteredNotes.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                {searchQuery ? (
                  <>
                    <h3 className="text-xl font-semibold">No notes found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No notes match your search "{searchQuery}". Try a
                      different search term.
                    </p>
                  </>
                ) : notes.length === 0 ? (
                  <>
                    <h3 className="text-xl font-semibold">
                      No notes yet. Create your first one!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Click the "Add Note" button above to get started.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">
                      No notes in this folder
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This folder is empty. Create a note or select a different
                      folder.
                    </p>
                  </>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredNotes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">
                      {note.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {note.content || "No content"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(note.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
   );
}
export default NoteList;