import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { Note } from "../types/note";
import type { Folder } from "../types/Folder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const NoteDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [note, setNote] = useState<Note | null>(null);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchNote();
    fetchFolders();
  }, [id]);

  async function fetchNote() {
    if (!id) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching note:", error);
    } else {
      setNote(data);
      setTitle(data.title);
      setContent(data.content || "");
      setFolderId(data.folder_id);
    }
  }

  async function fetchFolders() {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("name");
    if (error) {
      console.error("Error fetching folders:", error);
    } else {
      setFolders(data || []);
    }
  }

  async function handleUpdate() {
    if (!id) return;
    const { error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        folder_id: folderId,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
    } else {
      alert("Note updated successfully!");
    }
  }

  async function handleDelete() {
    if (!id) return;
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
    } else {
      navigate("/");
    }
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleUpdate}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="folder">Folder</Label>
          <Select
            value={folderId || "none"}
            onValueChange={(value) => setFolderId(value === "none" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Folder</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content"
            rows={15}
          />
        </div>

        <p className="text-sm text-gray-400">
          Created {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NoteDetail;