import { Folder as FolderIcon, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import logo from "./assets/logo-nlw-expert.svg";
import Button from "./components/Button";
import { FolderCard } from "./components/folder-card";
import { NewFolderCard } from "./components/new-folder-card";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
  folderId?: string | null;
}

interface Folder {
  id: string;
  name: string;
  notes: Note[];
}

export function App() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFolders, setShowFolders] = useState(true);
  const [folders, setFolders] = useState<Folder[]>(() => {
    const foldersOnStorage = localStorage.getItem("folders");

    if (foldersOnStorage) {
      return JSON.parse(foldersOnStorage);
    }

    return [];
  });
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onFolderCreated(name: string) {
    const newFolder = {
      id: crypto.randomUUID(),
      name,
      notes: [],
    };

    const foldersArray = [newFolder, ...folders];

    setFolders(foldersArray);
    setOpen(false);

    localStorage.setItem("folders", JSON.stringify(foldersArray));
  }

  function onFolderDeleted(id: string) {
    const folder = folders.find((f) => f.id === id);

    if (folder && folder.notes.length > 0) {
      // Move notas para "sem pasta"
      const notesFromFolder = folder.notes;
      const updatedNotes = [...notes, ...notesFromFolder];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }

    const foldersArray = folders.filter((folder) => folder.id !== id);

    setFolders(foldersArray);
    localStorage.setItem("folders", JSON.stringify(foldersArray));

    toast.success("Pasta excluída com sucesso!");
  }

  function onNoteCreated(content: string, folderId?: string | null) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
      folderId: folderId || null,
    };

    setOpen(!open);

    if (folderId) {
      // Adiciona nota à pasta
      const updatedFolders = folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            notes: [newNote, ...folder.notes],
          };
        }
        return folder;
      });

      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));
    } else {
      // Adiciona às notas sem pasta
      const notesArray = [newNote, ...notes];
      setNotes(notesArray);
      localStorage.setItem("notes", JSON.stringify(notesArray));
    }
  }

  function onNoteDeleted(id: string, folderId?: string) {
    if (folderId) {
      // Remove nota de pasta
      const updatedFolders = folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            notes: folder.notes.filter((note) => note.id !== id),
          };
        }
        return folder;
      });

      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));
    } else {
      // Remove das notas sem pasta
      const notesArray = notes.filter((note) => note.id !== id);
      setNotes(notesArray);
      localStorage.setItem("notes", JSON.stringify(notesArray));
    }

    toast.success("Nota excluída com sucesso!");
  }

  function onMoveNote(noteId: string, targetFolderId: string | null) {
    // Encontra a nota atual
    let noteToMove: Note | undefined;
    let sourceFolderId: string | null = null;

    // Procura nas notas sem pasta
    noteToMove = notes.find((n) => n.id === noteId);

    // Se não encontrou, procura nas pastas
    if (!noteToMove) {
      for (const folder of folders) {
        const foundNote = folder.notes.find((n) => n.id === noteId);
        if (foundNote) {
          noteToMove = foundNote;
          sourceFolderId = folder.id;
          break;
        }
      }
    }

    if (!noteToMove) return;

    // Remove da origem
    if (sourceFolderId) {
      const updatedFolders = folders.map((folder) => {
        if (folder.id === sourceFolderId) {
          return {
            ...folder,
            notes: folder.notes.filter((note) => note.id !== noteId),
          };
        }
        return folder;
      });
      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));
    } else {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }

    // Adiciona ao destino
    if (targetFolderId) {
      const updatedFolders = folders.map((folder) => {
        if (folder.id === targetFolderId) {
          return {
            ...folder,
            notes: [
              { ...noteToMove!, folderId: targetFolderId },
              ...folder.notes,
            ],
          };
        }
        return folder;
      });
      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));
    } else {
      const updatedNotes = [{ ...noteToMove, folderId: null }, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  }

  function handleClearAllNotes() {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar todas as notas? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
      setNotes([]);

      const clearedFolders = folders.map((folder) => ({
        ...folder,
        notes: [],
      }));

      setFolders(clearedFolders);

      localStorage.setItem("notes", JSON.stringify([]));
      localStorage.setItem("folders", JSON.stringify(clearedFolders));

      toast.success("Todas as notas foram limpas!");
    }
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  const filteredFolders =
    search !== ""
      ? folders
          .map((folder) => ({
            ...folder,
            notes: folder.notes.filter((note) =>
              note.content
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            ),
          }))
          .filter((folder) => folder.notes.length > 0)
      : folders;

  const totalNotes =
    notes.length +
    folders.reduce((acc, folder) => acc + folder.notes.length, 0);

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <NewFolderCard onFolderCreated={onFolderCreated} />
          <Button onClick={handleClearAllNotes} disabled={totalNotes === 0}>
            <Trash2 />
            Limpar todas as notas
          </Button>
        </div>

        {folders.length > 0 && (
          <Button onClick={() => setShowFolders(!showFolders)}>
            <FolderIcon />
            {showFolders ? "Ocultar pastas" : "Mostrar pastas"}
          </Button>
        )}
      </div>

      {showFolders && folders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Pastas</h2>
          <div className="space-y-3">
            {filteredFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onFolderDeleted={onFolderDeleted}
                onNoteDeleted={onNoteDeleted}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">
            {search ? "Resultados da busca" : "Notas sem pasta"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
            <NewNoteCard
              onNoteCreated={onNoteCreated}
              folders={folders}
              open={open}
              handleOpen={() => setOpen(!open)}
            />

            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onNoteDeleted={onNoteDeleted}
                folders={folders}
                onMoveNote={onMoveNote}
                currentFolderId={note.folderId}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && folders.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
          <NewNoteCard
            onNoteCreated={onNoteCreated}
            folders={folders}
            open={open}
            handleOpen={() => setOpen(!open)}
          />
        </div>
      )}

      {filteredNotes.length === 0 && folders.length > 0 && !search && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
          <NewNoteCard
            onNoteCreated={onNoteCreated}
            folders={folders}
            open={open}
            handleOpen={() => setOpen(!open)}
          />
        </div>
      )}

      {search && filteredNotes.length === 0 && filteredFolders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">
            Nenhuma nota encontrada para "{search}"
          </p>
        </div>
      )}
    </div>
  );
}
