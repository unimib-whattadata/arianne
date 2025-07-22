'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';
import {
  CalendarIcon as Calendar1Icon,
  Copy,
  Eye,
  GripHorizontal,
  Palette,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AttachmentBlock } from '@/features/referti/components/builderAttachment';
import { PaletteSheet } from '@/features/referti/components/paletteSheet';
import { SaveSheet } from '@/features/referti/components/saveSheet';
import { useExportReports } from '@/features/referti/hook/use-report-export';
import { usePatient } from '@/hooks/use-patient';
import { cn } from '@/utils/cn';

const formSchema = z.object({
  titleField: z.string().optional(),
  date: z.date(),
  time: z.string(),
  sections: z.array(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
  titles: z.array(z.object({ content: z.string().optional() })),
  paragraphs: z.array(z.object({ content: z.string().optional() })),
  attachments: z.array(
    z.object({
      name: z.string().optional(),
      date: z.string().optional(),
      type: z.string().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface ThemeSettings {
  font: string;
  titleSize: string;
  paragraphSize: string;
  primaryColor: string;
}

const defaultTheme: ThemeSettings = {
  font: 'poppins',
  titleSize: '14',
  paragraphSize: '12',
  primaryColor: '#000000',
};

interface SortableSectionProps {
  id: string;
  index: number;
  onCopy: (index: number) => void;
  onRemove: (index: number) => void;
  form: UseFormReturn<FormValues>;
  forceRenderKey: number;
}

function SortableSection({
  id,
  index,
  onCopy,
  onRemove,
  form,
  forceRenderKey,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-1 relative mb-3 rounded-md border border-primary bg-white p-4"
    >
      {/* Grip centrato in alto */}
      <div className="mb-3 flex items-center justify-center">
        <div
          className="cursor-grab p-1 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Sezione {index + 1}</h3>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onCopy(index)}
            className="p-1 hover:text-primary"
            aria-label="Copia sezione"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 hover:text-red-500"
            aria-label="Elimina sezione"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          key={`section-title-${index}-${forceRenderKey}`}
          control={form.control}
          name={`sections.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo della sezione</FormLabel>
              <FormControl>
                <Input placeholder="Text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          key={`section-description-${index}-${forceRenderKey}`}
          control={form.control}
          name={`sections.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione della sezione</FormLabel>
              <FormControl>
                <Input placeholder="Text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface SortableTitleProps {
  id: string;
  index: number;
  onCopy: (index: number) => void;
  onRemove: (index: number) => void;
  form: UseFormReturn<FormValues>;
  forceRenderKey: number;
}

function SortableTitle({
  id,
  index,
  onCopy,
  onRemove,
  form,
  forceRenderKey,
}: SortableTitleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mb-3 rounded-md bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-center">
        <div
          className="cursor-grab p-1 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Titolo {index + 1}</h3>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onCopy(index)}
            className="p-1 hover:text-primary"
            aria-label="Copia titolo"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 hover:text-red-500"
            aria-label="Elimina titolo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          key={`title-content-${index}-${forceRenderKey}`}
          control={form.control}
          name={`titles.${index}.content`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface SortableParagraphProps {
  id: string;
  index: number;
  onCopy: (index: number) => void;
  onRemove: (index: number) => void;
  form: UseFormReturn<FormValues>;
  forceRenderKey: number;
}

function SortableParagraph({
  id,
  index,
  onCopy,
  onRemove,
  form,
  forceRenderKey,
}: SortableParagraphProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mb-3 rounded-md bg-white p-4"
    >
      {/* Grip centrato in alto */}
      <div className="mb-3 flex items-center justify-center">
        <div
          className="cursor-grab p-1 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Paragrafo {index + 1}</h3>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onCopy(index)}
            className="p-1 hover:text-primary"
            aria-label="Copia paragrafo"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 hover:text-red-500"
            aria-label="Elimina paragrafo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          key={`paragraph-content-${index}-${forceRenderKey}`}
          control={form.control}
          name={`paragraphs.${index}.content`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Text"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface SortableAttachmentProps {
  id: string;
  index: number;
  onCopy: (index: number) => void;
  onRemove: (index: number) => void;
  forceRenderKey: number;
}

function SortableAttachment({
  id,
  index,
  onCopy,
  onRemove,
  forceRenderKey,
}: SortableAttachmentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <AttachmentBlock
        key={`attachment-${index}-${forceRenderKey}`}
        index={index}
        onRemove={() => onRemove(index)}
        onCopy={() => onCopy(index)}
        dragHandleProps={{ attributes, listeners }}
      />
    </div>
  );
}

export default function NewBuilder() {
  const [openAspettoSheet, setOpenAspettoSheet] = useState(false);
  const [openSalvaSheet, setOpenSalvaSheet] = useState(false);
  const [history, setHistory] = useState<FormValues[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(defaultTheme);
  const [reportTitle, setReportTitle] = useState('');
  const [forceRenderKey, setForceRenderKey] = useState(0);

  const lastSavedState = useRef<string>('');
  const historyTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const { patient } = usePatient();
  const { previewFromBuilder, isExporting } = useExportReports();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleField: '',
      date: new Date(),
      time: new Date().toTimeString().slice(0, 5),
      sections: [],
      titles: [],
      paragraphs: [],
      attachments: [],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({ control: form.control, name: 'sections' });

  const {
    fields: titleFields,
    append: appendTitle,
    remove: removeTitle,
    move: moveTitle,
  } = useFieldArray({ control: form.control, name: 'titles' });

  const {
    fields: paragraphFields,
    append: appendParagraph,
    remove: removeParagraph,
    move: moveParagraph,
  } = useFieldArray({ control: form.control, name: 'paragraphs' });

  const {
    fields: attachmentFields,
    append: appendAttachment,
    remove: removeAttachment,
    move: moveAttachment,
  } = useFieldArray({ control: form.control, name: 'attachments' });

  const saveToHistory = useCallback(
    (formValues: FormValues) => {
      const currentStateString = JSON.stringify(formValues);

      if (currentStateString === lastSavedState.current) {
        return;
      }

      lastSavedState.current = currentStateString;

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(formValues);
        return newHistory;
      });

      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const debouncedSaveToHistory = useCallback(
    (formValues: FormValues) => {
      if (historyTimeout.current) {
        clearTimeout(historyTimeout.current);
      }

      historyTimeout.current = setTimeout(() => {
        if (!isUndoRedo) {
          saveToHistory(formValues);
        }
      }, 300);
    },
    [saveToHistory, isUndoRedo],
  );

  const handleAddSection = () => {
    appendSection({ title: '', description: '' });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleAddTitle = () => {
    appendTitle({ content: '' });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleAddParagraph = () => {
    appendParagraph({ content: '' });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleAddAttachment = () => {
    appendAttachment({});
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleCopySection = (index: number) => {
    const sectionToCopy = form.getValues(`sections.${index}`);
    appendSection({ ...sectionToCopy });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleCopyTitle = (index: number) => {
    const titleToCopy = form.getValues(`titles.${index}`);
    appendTitle({ ...titleToCopy });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleCopyParagraph = (index: number) => {
    const paragraphToCopy = form.getValues(`paragraphs.${index}`);
    appendParagraph({ ...paragraphToCopy });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const handleCopyAttachment = (index: number) => {
    const attachmentToCopy = form.getValues(`attachments.${index}`);
    appendAttachment({ ...attachmentToCopy });
    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const allItems = [
    ...sectionFields.map((field) => ({
      id: `section-${field.id}`,
      type: 'section',
      originalId: field.id,
    })),
    ...titleFields.map((field) => ({
      id: `title-${field.id}`,
      type: 'title',
      originalId: field.id,
    })),
    ...paragraphFields.map((field) => ({
      id: `paragraph-${field.id}`,
      type: 'paragraph',
      originalId: field.id,
    })),
    ...attachmentFields.map((field) => ({
      id: `attachment-${field.id}`,
      type: 'attachment',
      originalId: field.id,
    })),
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const [activeType, activeOriginalId] = parseItemId(activeId);
    const [overType, overOriginalId] = parseItemId(overId);

    if (activeType !== overType) {
      return;
    }

    const activeIndex = findIndexInArray(activeType, activeOriginalId);
    const overIndex = findIndexInArray(overType, overOriginalId);

    if (activeIndex === -1 || overIndex === -1) return;

    moveItemInSameArray(activeType, activeIndex, overIndex);

    setForceRenderKey((prev) => prev + 1);

    setTimeout(() => {
      const currentValues = form.getValues();
      saveToHistory(currentValues);
    }, 50);
  };

  const parseItemId = (id: string): [string, string] => {
    const match = /^(section|title|paragraph|attachment)-(.+)$/.exec(id);
    if (!match) return ['', ''];
    return [match[1], match[2]];
  };

  const findIndexInArray = (type: string, originalId: string): number => {
    switch (type) {
      case 'section':
        return sectionFields.findIndex((field) => field.id === originalId);
      case 'title':
        return titleFields.findIndex((field) => field.id === originalId);
      case 'paragraph':
        return paragraphFields.findIndex((field) => field.id === originalId);
      case 'attachment':
        return attachmentFields.findIndex((field) => field.id === originalId);
      default:
        return -1;
    }
  };

  const moveItemInSameArray = (
    type: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    switch (type) {
      case 'section':
        moveSection(fromIndex, toIndex);
        break;
      case 'title':
        moveTitle(fromIndex, toIndex);
        break;
      case 'paragraph':
        moveParagraph(fromIndex, toIndex);
        break;
      case 'attachment':
        moveAttachment(fromIndex, toIndex);
        break;
    }
  };

  useEffect(() => {
    const subscription = form.watch((values) => {
      const formValues = values as FormValues;

      if (!isUndoRedo && formValues) {
        debouncedSaveToHistory(formValues);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (historyTimeout.current) {
        clearTimeout(historyTimeout.current);
      }
    };
  }, [form, debouncedSaveToHistory, isUndoRedo]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = history[newIndex];

      form.reset(previousState);

      lastSavedState.current = JSON.stringify(previousState);

      setTimeout(() => {
        setIsUndoRedo(false);
      }, 100);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = history[newIndex];

      form.reset(nextState);

      lastSavedState.current = JSON.stringify(nextState);

      setTimeout(() => {
        setIsUndoRedo(false);
      }, 100);
    }
  };

  const handleThemeChange = (theme: ThemeSettings) => {
    setCurrentTheme(theme);
  };

  const handlePreview = async () => {
    const formData = form.getValues();
    await previewFromBuilder({
      ...formData,
      theme: currentTheme,
    });
  };

  const watchedTitleField = form.watch('titleField');
  useEffect(() => {
    if (watchedTitleField) {
      setReportTitle(watchedTitleField);
    }
  }, [watchedTitleField, form]);

  useEffect(() => {
    const initialValues = form.getValues();
    setHistory([initialValues]);
    lastSavedState.current = JSON.stringify(initialValues);
  }, [form]);

  if (!patient) {
    return <div className="p-4 pt-0">Caricamento paziente...</div>;
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="text-2xl font-bold">Builder</h1>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
        >
          <Undo2 />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
        >
          <Redo2 />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenAspettoSheet(true)}
        >
          <Palette />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreview}
          disabled={isExporting}
        >
          <Eye />
        </Button>
        <Button variant="outline" onClick={() => setOpenSalvaSheet(true)}>
          <Save className="mr-2" />
          Salva
        </Button>
      </div>

      <Form {...form}>
        <Accordion
          type="multiple"
          defaultValue={['data', 'content']}
          className="w-full"
        >
          <AccordionItem value="data" className="border-none">
            <AccordionTrigger className="no-underline hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">Dati </div>
              </div>
            </AccordionTrigger>
            <Separator className="mb-2" />
            <AccordionContent>
              <div className="rounded-md bg-white p-4">
                <h2 className="mb-3 font-semibold">Dettagli</h2>

                <div className="flex flex-row gap-3">
                  <div className="basis-2/4">
                    <FormField
                      control={form.control}
                      name="titleField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Titolo{' '}
                            <span className="text-primary">Obbligatorio</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Text" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Data{' '}
                            <span className="text-primary">Obbligatorio</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="input"
                                  className={cn(
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: it })
                                  ) : (
                                    <span>Seleziona la data</span>
                                  )}
                                  <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1/4">
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Ora{' '}
                            <span className="text-primary">Obbligatorio</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="content" className="border-none">
            <AccordionTrigger className="no-underline hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">Contenuto </div>
              </div>
            </AccordionTrigger>
            <Separator className="mb-2" />

            <AccordionContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={allItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {/* Sezioni */}
                  {sectionFields.map((field, index) => (
                    <SortableSection
                      key={`section-${field.id}-${forceRenderKey}`}
                      id={`section-${field.id}`}
                      index={index}
                      onCopy={handleCopySection}
                      onRemove={removeSection}
                      form={form}
                      forceRenderKey={forceRenderKey}
                    />
                  ))}

                  {/* Titoli */}
                  {titleFields.map((field, index) => (
                    <SortableTitle
                      key={`title-${field.id}-${forceRenderKey}`}
                      id={`title-${field.id}`}
                      index={index}
                      onCopy={handleCopyTitle}
                      onRemove={removeTitle}
                      form={form}
                      forceRenderKey={forceRenderKey}
                    />
                  ))}

                  {/* Paragrafi */}
                  {paragraphFields.map((field, index) => (
                    <SortableParagraph
                      key={`paragraph-${field.id}-${forceRenderKey}`}
                      id={`paragraph-${field.id}`}
                      index={index}
                      onCopy={handleCopyParagraph}
                      onRemove={removeParagraph}
                      form={form}
                      forceRenderKey={forceRenderKey}
                    />
                  ))}

                  {/* Allegati */}
                  {attachmentFields.map((field, index) => (
                    <SortableAttachment
                      key={`attachment-${field.id}-${forceRenderKey}`}
                      id={`attachment-${field.id}`}
                      index={index}
                      onCopy={handleCopyAttachment}
                      onRemove={removeAttachment}
                      forceRenderKey={forceRenderKey}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-base text-primary hover:underline"
                  onClick={handleAddSection}
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi sezione
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-base text-primary hover:underline"
                  onClick={handleAddTitle}
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi titolo
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-base text-primary hover:underline"
                  onClick={handleAddParagraph}
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi paragrafo
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-base text-primary hover:underline"
                  onClick={handleAddAttachment}
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi allegato
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Form>

      {/* Sheets */}
      <PaletteSheet
        open={openAspettoSheet}
        onOpenChange={setOpenAspettoSheet}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      <SaveSheet
        open={openSalvaSheet}
        onOpenChange={setOpenSalvaSheet}
        formData={{
          ...form.getValues(),
          theme: currentTheme,
        }}
        isEditing={false}
        patientId={patient.id}
        existingTitle={reportTitle}
      />
    </div>
  );
}
