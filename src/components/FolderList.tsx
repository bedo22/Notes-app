import { useEffect,useState , useRef } from "react"
import { supabase } from "../lib/supabaseClient";
import type { Folder } from "@/types/Folder";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useAuth } from "./AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FolderPlus, FolderEdit, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  selectedFolderId: string | null;           // currently selected folder id
  onSelectFolder: (id: string | null) => void; // callback when user clicks a folder
};

export const FolderList = ({ selectedFolderId, onSelectFolder }: Props) => {
    const {user} = useAuth();
    const [folders, setFolders] = useState<Folder[]>([]);
    const hasCreatedDefault = useRef(false); //Prvents duplicate creation

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [renameFolderName, setRenameFolderName] = useState("");
    const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);

    async function handleAddFolder() {
      if (!newFolderName.trim()) {
        toast.error("Folder name required", {
          description: "Please enter a folder name",
        });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("folders").insert([
        {
          name: newFolderName.trim(),
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error creating folder:", error);
        toast.error("Failed to create folder", {
          description: error.message,
        });
      } else {
        toast.success("Folder created!", {
          description: `"${newFolderName.trim()}" has been added.`,
        });
        fetchFolders();
        setNewFolderName("");
        setIsAddDialogOpen(false);
      }
    }

    async function handleRenameFolder() {
      if (!folderToEdit || !renameFolderName.trim()) {
        toast.error("Folder name required", {
          description: "Please enter a folder name",
        });
        return;
      }

      const { error } = await supabase
        .from("folders")
        .update({ name: renameFolderName.trim() })
        .eq("id", folderToEdit.id);

      if (error) {
        console.error("Error renaming folder:", error);
        toast.error("Failed to rename folder", {
          description: error.message,
        });
      } else {
        toast.success("Folder renamed!", {
          description: `Renamed to "${renameFolderName.trim()}"`,
        });
        fetchFolders();
        setRenameFolderName("");
        setFolderToEdit(null);
        setIsRenameDialogOpen(false);
      }
    }

    async function handleDeleteFolder() {
      if (!folderToEdit) return;

      // First, update all notes in this folder to have null folder_id
      const { error: notesError } = await supabase
        .from("notes")
        .update({ folder_id: null })
        .eq("folder_id", folderToEdit.id);

      if (notesError) {
        console.error("Error updating notes:", notesError);
        toast.error("Failed to delete folder", {
          description: "Could not move notes to 'All Notes'",
        });
        return;
      }

      // Then delete the folder
      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderToEdit.id);

      if (error) {
        console.error("Error deleting folder:", error);
        toast.error("Failed to delete folder", {
          description: error.message,
        });
      } else {
        if (selectedFolderId === folderToEdit.id) {
          onSelectFolder(null);
        }
        fetchFolders();
        setFolderToEdit(null);
        setIsDeleteDialogOpen(false);
      }
    }

    function openRenameDialog(folder: Folder) {
      setFolderToEdit(folder);
      setRenameFolderName(folder.name);
      setIsRenameDialogOpen(true);
    }

    function openDeleteDialog(folder: Folder) {
      setFolderToEdit(folder);
      setIsDeleteDialogOpen(true);
    }

    const fetchFolders = async () => {
    const { data, error } = await supabase.from("folders").select("*").order("created_at", {ascending: true});
    if (error) {
      console.error(error);
      return;
    }
    // If no folders exist, create a "General" one
    if ((!data || data.length === 0) && !hasCreatedDefault.current) {
      hasCreatedDefault.current = true;
      const { error: insertError, data: inserted } = await supabase
        .from("folders")
        .insert([{ name: "General", user_id: user?.id }])
        .select();
      if (insertError) { console.error(insertError); return; }
      // set folders using freshly inserted row(s)
      setFolders(inserted || []);
      // optionally auto-select the default folder:
      if (inserted && inserted[0]) onSelectFolder(inserted[0].id);
      return;
    } setFolders(data || []);
    // if nothing selected yet, pick the first folder automatically:
    if ((!selectedFolderId || selectedFolderId === null) && data && data.length > 0) {
      onSelectFolder(data[0].id);
    }
  };
    
    useEffect(() => {
      fetchFolders();
    },[user]);

  return (
    <aside className="w-1/4 border-r h-screen flex flex-col bg-card">
    {/* Header with Add Button */}
    <div className="p-2 border-b">
      <h2 className="text-lg font-semibold">Folders</h2>
      
      {/* Add Folder Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2 w-full">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddFolder();
                  }
                }}
                placeholder="My Folder"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setNewFolderName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

      {/* Folders List with ScrollArea */}
    <ScrollArea className="flex-1 p-2 overflow-y-auto">
      {/* All Notes Option */}
      <div
        onClick={() => onSelectFolder(null)}
        className={`p-2 rounded-md cursor-pointer ${
          selectedFolderId === null
            ? "bg-accent text-black"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        All Notes
      </div>
        {folders.length === 0 ? (
          <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No folders yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create one to organize your notes
          </p>
        </div>
        ) : (
          /* Folders List with Edit/Delete Buttons */
        <ul className="space-y-1">
          {folders.map((folder) => ( 
            <li
              key={folder.id}
              className="flex items-center gap-1 group rounded-md"
            >
              {/* Folder Name - Clickable */}
              <div
                onClick={() => onSelectFolder(folder.id)}
                className={`flex-1 p-2 rounded-md cursor-pointer ${
                  selectedFolderId === folder.id
                    ? "bg-accent"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {folder.name}
              </div>

              {/* Edit/Delete Buttons - Show on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRenameDialog(folder);
                  }}
                >
                  <FolderEdit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(folder);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </ScrollArea>
      {/* Footer */}
      <Separator />
      <div className="p-3 text-xs text-muted-foreground">QuickNotes © 2025</div>

        {/* Rename Dialog - Outside ScrollArea */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for "{folderToEdit?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-folder">Folder Name</Label>
              <Input
                id="rename-folder"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameFolder();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameDialogOpen(false);
                setRenameFolderName("");
                setFolderToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog - Outside ScrollArea */}
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{folderToEdit?.name}"? Notes in
            this folder will be moved to "All Notes".
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setFolderToEdit(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteFolder}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </aside>
  );
}

export default FolderList;