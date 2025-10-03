import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, ChevronRight, Folder, Trash2, X } from "lucide-react";
import { useState } from "react";
import { NoteCard } from "./note-card";

interface Note {
	id: string;
	date: Date;
	content: string;
}

interface FolderCardProps {
	folder: {
		id: string;
		name: string;
		notes: Note[];
	};
	onFolderDeleted: (id: string) => void;
	onNoteDeleted: (noteId: string, folderId: string) => void;
}

export function FolderCard({ folder, onFolderDeleted, onNoteDeleted }: FolderCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="rounded-md bg-slate-800 border border-slate-700">
			<div
				className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center gap-3">
					{isExpanded ? (
						<ChevronDown className="size-5 text-slate-400" />
					) : (
						<ChevronRight className="size-5 text-slate-400" />
					)}
					<Folder className="size-5 text-lime-400" />
					<span className="text-sm font-medium text-slate-200">{folder.name}</span>
					<span className="text-xs text-slate-500">
						({folder.notes.length} {folder.notes.length === 1 ? "nota" : "notas"})
					</span>
				</div>
				<Dialog.Root>
					<Dialog.Trigger
						onClick={(e) => e.stopPropagation()}
						className="p-2 hover:bg-slate-600 rounded-md transition-colors"
					>
						<Trash2 className="size-4 text-slate-400 hover:text-red-400" />
					</Dialog.Trigger>

					<Dialog.Portal>
						<Dialog.Overlay className="inset-0 fixed bg-black/50" />
						<Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[40vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
							<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
								<X className="size-5" />
							</Dialog.Close>
							<div className="flex flex-1 flex-col gap-3 p-5">
								<span className="text-sm font-medium text-slate-300">
									Excluir pasta "{folder.name}"
								</span>
								<p className="text-sm leading-6 text-slate-400">
									{folder.notes.length > 0 ? (
										<>
											Esta pasta contém <strong>{folder.notes.length}</strong>{" "}
											{folder.notes.length === 1 ? "nota" : "notas"}. Ao excluir a pasta, as notas
											serão movidas para "Notas sem pasta".
										</>
									) : (
										"Esta pasta está vazia e será excluída permanentemente."
									)}
								</p>
							</div>

							<button
								type="button"
								onClick={() => onFolderDeleted(folder.id)}
								className="w-full bg-red-500 py-4 text-center text-sm text-white outline-none font-medium hover:bg-red-600"
							>
								Sim, excluir pasta
							</button>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>

			{isExpanded && folder.notes.length > 0 && (
				<div className="p-4 pt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-4">
						{folder.notes.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onNoteDeleted={(noteId) => onNoteDeleted(noteId, folder.id)}
							/>
						))}
					</div>
				</div>
			)}

			{isExpanded && folder.notes.length === 0 && (
				<div className="p-4 pt-0">
					<p className="text-sm text-slate-500 text-center py-8">
						Esta pasta ainda não possui notas
					</p>
				</div>
			)}
		</div>
	);
}
