import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddNoteFormProps {
  selectedFolderId: string | null;
  onNoteAdded: (FolderId?: string | null) => Promise<void>;
}

export function AddNoteForm({selectedFolderId, onNoteAdded}: AddNoteFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {user} = useAuth();

      async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please enter a note title",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from("notes").insert([{
        title,
        content,
        folder_id: selectedFolderId,
        user_id: user?.id,
      }]);
      
      if (error) {
        console.error("Error adding note:", error);
        toast.error("Failed to create note", {
          description: error.message,
        });
        return;
      }

      // Success!
      toast.success("Note created!", {
        description: `"${title}" has been added successfully.`,
      });
      
      // Reset form and close dialog
      setTitle("");
      setContent("");
      setOpen(false);
      
      // Notify parent to refresh
      await onNoteAdded();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to create note", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={addNote}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}