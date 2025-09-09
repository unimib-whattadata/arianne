import 'quill/dist/quill.snow.css';

import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuillEditor({ value, onChange }: QuillEditorProps) {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
    placeholder: 'Scrivi qui il tuo testo...',
  });

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill, value]);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill, onChange]);

  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
}
