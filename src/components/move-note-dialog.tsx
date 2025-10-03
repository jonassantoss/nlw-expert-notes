import * as Dialog from "@radix-ui/react-dialog";
import { FolderInput, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Folder {
	id: string;
	name: string;
}

interface MoveNoteDialogProps {
	noteId: string;
	folders: Folder[];
	onMoveNote: (noteId: string, folderId: string | null) => void;
	currentFolderId?: string | null;
}

export function MoveNoteDialog({
	noteId,
	folders,
	onMoveNote,
	currentFolderId,
}: MoveNoteDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null);

	function handleMoveNote() {
		if (selectedFolderId === currentFolderId) {
			toast.info("A nota já está nesta localização");
			return;
		}

		onMoveNote(noteId, selectedFolderId);
		setIsOpen(false);

		if (selectedFolderId === null) {
			toast.success("Nota movida para 'Notas sem pasta'");
		} else {
			const folder = folders.find((f) => f.id === selectedFolderId);
			toast.success(`Nota movida para '${folder?.name}'`);
		}
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 flex items-center justify-center gap-2">
				<FolderInput className="size-4" />
				Mover para pasta
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 fixed bg-black/50" />
				<Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
					<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>

					<div className="flex flex-1 flex-col gap-3 p-5">
						<span className="text-sm font-medium text-slate-300">Mover nota para pasta</span>
						<p className="text-sm leading-6 text-slate-400 mb-4">
							Selecione a pasta de destino para esta nota
						</p>

						<div className="flex-1 overflow-y-auto space-y-2">
							<button
								type="button"
								onClick={() => setSelectedFolderId(null)}
								className={`w-full text-left p-3 rounded-md transition-colors ${
									selectedFolderId === null
										? "bg-lime-400 text-lime-950"
										: "bg-slate-800 text-slate-300 hover:bg-slate-600"
								}`}
							>
								<span className="font-medium">Notas sem pasta</span>
							</button>

							{folders.map((folder) => (
								<button
									key={folder.id}
									type="button"
									onClick={() => setSelectedFolderId(folder.id)}
									className={`w-full text-left p-3 rounded-md transition-colors ${
										selectedFolderId === folder.id
											? "bg-lime-400 text-lime-950"
											: "bg-slate-800 text-slate-300 hover:bg-slate-600"
									}`}
								>
									<span className="font-medium">{folder.name}</span>
								</button>
							))}

							{folders.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-8">
									Nenhuma pasta criada ainda
								</p>
							)}
						</div>
					</div>

					<button
						type="button"
						onClick={handleMoveNote}
						className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
					>
						Mover nota
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
