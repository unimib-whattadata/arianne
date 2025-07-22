'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  CloudUpload,
  Copy,
  FileText,
  GripHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import type React from 'react';
// import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNotes } from '@/features/patient/notes/hooks/use-notes';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

interface FileType {
  id: string;
  name: string;
  date: string;
  type: string;
}

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

export function AttachmentBlock({
  index,
  onRemove,
  onCopy,
  disabled = false,
  dragHandleProps,
}: {
  index: number;
  onRemove: () => void;
  onCopy: () => void;
  disabled?: boolean;
  dragHandleProps?: DragHandleProps;
}) {
  const [openSheet, setOpenSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<FileType | null>(null);
  const [allFiles, setAllFiles] = useState<FileType[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useFormContext();

  const { patient } = usePatient();
  const api = useTRPC();

  const { notes } = useNotes();

  const { data: cognitiveBehavioralDiaries } = useQuery(
    api.diary.getAll.queryOptions(
      { type: 'cognitive_beahvioral', patientId: patient?.id },
      { enabled: !!patient?.id },
    ),
  );

  const { data: foodDiaries } = useQuery(
    api.diary.getAll.queryOptions(
      { type: 'food', patientId: patient?.id },
      { enabled: !!patient?.id },
    ),
  );

  const { data: administrations } = useQuery(
    api.administration.findMany.queryOptions(
      { where: { patientId: patient?.id } },
      { enabled: !!patient?.id },
    ),
  );

  useEffect(() => {
    const currentAttachment = form.getValues(
      `attachments.${index}`,
    ) as FileType;
    if (currentAttachment && (currentAttachment.name || currentAttachment.id)) {
      setUploadedFile({
        id: currentAttachment.id || Math.random().toString(36).substring(7),
        name: currentAttachment.name || 'File sconosciuto',
        date: currentAttachment.date || new Date().toLocaleDateString('it-IT'),
        type: currentAttachment.type || 'File',
      });
    }
  }, [form, index]);

  useEffect(() => {
    const filesArray: FileType[] = [];

    if (notes) {
      notes.forEach((note) => {
        filesArray.push({
          id: note.id,
          name: note.title || 'Nota senza titolo',
          date: new Date(note.date).toLocaleDateString('it-IT'),
          type: 'Note',
        });
      });
    }

    interface DiaryType {
      id: string;
      date: string | Date;
    }

    const addDiaries = (
      diaries: DiaryType[] | undefined,
      diaryType: string,
    ) => {
      if (diaries) {
        diaries.forEach((diary) => {
          filesArray.push({
            id: diary.id,
            name: `Diario ${diaryType}`,
            date: new Date(diary.date).toLocaleDateString('it-IT'),

            type: 'Diari',
          });
        });
      }
    };

    addDiaries(cognitiveBehavioralDiaries, 'cognitivo-comportamentale');
    addDiaries(foodDiaries, 'alimentare');

    if (administrations) {
      administrations.forEach((administration) => {
        filesArray.push({
          id: administration.id,
          name: `${administration.type} - T${administration.T}`,
          date: new Date(administration.date).toLocaleDateString('it-IT'),
          type: 'Somministrazioni',
        });
      });
    }

    setAllFiles(filesArray);
  }, [notes, cognitiveBehavioralDiaries, foodDiaries, administrations]);

  const updateFormValue = (file: FileType | null) => {
    setUploadedFile(file);

    if (file) {
      form.setValue(`attachments.${index}`, {
        id: file.id,
        name: file.name,
        date: file.date,
        type: file.type,
      });
    } else {
      form.setValue(`attachments.${index}`, {});
    }
  };

  // const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (disabled) return;

  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const newFile = {
  //       id: Math.random().toString(36).substring(7),
  //       name: file.name,
  //       date: new Date().toLocaleDateString('it-IT'),
  //       type: 'File',
  //     };
  //     updateFormValue(newFile);
  //   }
  // };

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   if (disabled) return;
  //   e.preventDefault();
  // };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   if (disabled) return;
  //   e.preventDefault();
  //   const file = e.dataTransfer.files?.[0];
  //   if (file) {
  //     const newFile = {
  //       id: Math.random().toString(36).substring(7),
  //       name: file.name,
  //       date: new Date().toLocaleDateString('it-IT'),
  //       type: 'File',
  //     };
  //     updateFormValue(newFile);
  //   }
  // };

  const handleAddSelected = () => {
    if (disabled) return;

    if (selectedFileId) {
      const selectedFile = allFiles.find((file) => file.id === selectedFileId);
      if (selectedFile) {
        updateFormValue(selectedFile);
        setOpenSheet(false);
        setSelectedFileId(null);
      }
    }
  };

  const handleRemoveFile = () => {
    if (disabled) return;
    updateFormValue(null);
  };

  const handleSort = (field: 'name' | 'date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredFiles = allFiles
    .filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? file.type === selectedType : true;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    });

  return (
    <div className="relative mb-3 rounded-md bg-white p-4">
      {/* CORREZIONE: Grip centrato in alto */}
      <div className="mb-3 flex items-center justify-center">
        {dragHandleProps ? (
          <div
            className="cursor-grab p-1 active:cursor-grabbing"
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}
          >
            <GripHorizontal className="h-4 w-4 text-slate-400" />
          </div>
        ) : (
          <GripHorizontal className="h-4 w-4 text-slate-400" />
        )}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Allegato {index + 1}</h3>
        {!disabled && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onCopy}
              className="p-1 hover:text-primary"
              aria-label="Copia allegato"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-1 hover:text-red-500"
              aria-label="Elimina allegato"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!uploadedFile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center ${
                !disabled
                  ? 'hover:bg-slate-50'
                  : 'cursor-not-allowed opacity-70'
              }`}
              onClick={() => !disabled && setOpenSheet(true)}
            >
              <div className="mb-2 rounded-full bg-slate-200 p-2">
                <CloudUpload className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-sm font-medium">Sfoglia la cartella clinica</p>
            </div>

            {/*  Upload da computer */}
            {/*
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center ${
                !disabled
                  ? 'hover:bg-slate-50'
                  : 'cursor-not-allowed opacity-70'
              }`}
              onClick={() => !disabled && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="application/pdf"
                disabled={disabled}
              />
              <div className="mb-2 rounded-full bg-slate-200 p-2">
                <CloudUpload className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-sm font-medium">Sfoglia o trascina un file</p>
            </div>
            */}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <h4 className="font-medium">{uploadedFile.name}</h4>
                <p className="text-sm text-slate-500">{uploadedFile.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={handleRemoveFile}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Allegati</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cerca"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Filtra per tipologia</p>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Note">Note</SelectItem>
                  <SelectItem value="Diari">Diari</SelectItem>
                  <SelectItem value="Somministrazioni">
                    Somministrazioni
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredFiles.length > 0 ? (
                <div className="max-h-[400px] space-y-2 overflow-y-auto">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-3 py-2 text-sm font-medium">
                    <div></div>
                    <div className="flex items-center">
                      Nome
                      <button
                        onClick={() => handleSort('name')}
                        className="ml-1"
                      >
                        {sortBy === 'name' && sortDirection === 'asc' ? (
                          <ArrowUpWideNarrow className="h-4 w-4" />
                        ) : (
                          <ArrowDownNarrowWide className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      Data
                      <button
                        onClick={() => handleSort('date')}
                        className="ml-1"
                      >
                        {sortBy === 'date' && sortDirection === 'asc' ? (
                          <ArrowUpWideNarrow className="h-4 w-4" />
                        ) : (
                          <ArrowDownNarrowWide className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border px-3 py-2 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={selectedFileId === file.id}
                        onCheckedChange={() => setSelectedFileId(file.id)}
                      />
                      <div>
                        <span className="text-sm text-primary underline">
                          {file.name}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">{file.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-slate-500">
                    Nessun risultato trovato
                  </p>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleAddSelected}
              disabled={!selectedFileId}
            >
              Aggiungi
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
