export enum NoteStatus {
    New,
    Completed,
    NotCompleted,
}

export interface NoteContent {
    title: string;
    content: string;
    status: NoteStatus;
}

export interface Note extends NoteContent {
    id: number;
}

export const NoteStatusDictionary: { [id: number]: string; } = {
    [NoteStatus.New]: 'New',
    [NoteStatus.Completed]: 'Completed',
    [NoteStatus.NotCompleted]: 'Not completed',
};
