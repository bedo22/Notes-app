export interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    folder_id: string | null;
    user_id: string;
}