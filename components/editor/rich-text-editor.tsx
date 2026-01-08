'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Quote,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
            }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Tulis konten berita di sini...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md">
            {/* Toolbar */}
            <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bold') ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="h-8 w-8 p-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button" 
                    size="sm"
                    variant={editor.isActive('italic') ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="h-8 w-8 p-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="h-8 px-2"
                >
                    H2
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className="h-8 px-2"
                >
                    H3
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="h-8 w-8 p-0"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className="h-8 w-8 p-0"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className="h-8 w-8 p-0"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive('link') ? 'default' : 'ghost'}
                    onClick={setLink}
                    className="h-8 w-8 p-0"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="px-0" />
        </div>
    );
}
