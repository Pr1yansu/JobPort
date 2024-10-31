"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import ToolBar from "@/components/rich-text-toolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (richText: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-2xl font-bold",
          levels: [2],
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-background focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className="flex flex-col justify-stretch min-h-[250px] list-disc"
      id="rich-text-editor"
    >
      <ToolBar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-1"
        id="editor-content"
        placeholder="Write something..."
        autoFocus={true}
      />
    </div>
  );
};

export default RichTextEditor;
