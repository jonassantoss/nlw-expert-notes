import * as Dialog from "@radix-ui/react-dialog";
import { FolderPlus, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import Button from "./Button";

interface NewFolderCardProps {
  onFolderCreated: (name: string) => void;
}

export function NewFolderCard({ onFolderCreated }: NewFolderCardProps) {
  const [folderName, setFolderName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleFolderNameChanged(event: ChangeEvent<HTMLInputElement>) {
    setFolderName(event.target.value);
  }

  function handleCreateFolder(event: FormEvent) {
    event.preventDefault();

    if (folderName.trim() === "") {
      toast.error("O nome da pasta não pode estar vazio!");
      return;
    }

    onFolderCreated(folderName.trim());

    setFolderName("");
    setIsOpen(false);

    toast.success("Pasta criada com sucesso!");
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <FolderPlus />
          Nova pasta
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[40vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form onSubmit={handleCreateFolder} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Criar nova pasta
              </span>
              <p className="text-sm leading-6 text-slate-400 mb-4">
                Digite o nome da pasta para organizar suas notas
              </p>
              <input
                type="text"
                autoFocus
                placeholder="Nome da pasta..."
                className="text-sm leading-6 text-slate-200 bg-slate-800 rounded-md p-3 outline-none focus:ring-2 focus:ring-lime-400"
                onChange={handleFolderNameChanged}
                value={folderName}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
            >
              Criar pasta
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
