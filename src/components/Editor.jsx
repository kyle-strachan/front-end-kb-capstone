import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor as ClassicEditorBase,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    BlockQuote,
    List,
    Link,
    Image,
    ImageToolbar,
    ImageUpload,
    Table,
    TableToolbar
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { api } from '../api';

// =============================
// 1. Custom Upload Adapter
// =============================

class CustomUploadAdapter {
    constructor(loader, docId) {
        this.loader = loader;
        this.docId = docId;
    }

    upload() {
        return this.loader.file.then(file => {
            const formData = new FormData();
            formData.append("image", file);

            return api.post(
                `${import.meta.env.VITE_API_URL}/docs/${this.docId}/upload-image`,
                formData,
                { withCredentials: true }
            )
                .then(res => ({ default: res.data.url }));
        });
    }
}

// =============================
// 2. Plugin that registers adapter
// =============================

function UploadPlugin(editor, docId) {
    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new CustomUploadAdapter(loader, docId);
    };
}

// =============================
// Editor build
// =============================

class ClassicEditor extends ClassicEditorBase { }

ClassicEditor.builtinPlugins = [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    BlockQuote,
    List,
    Link,
    Image,
    ImageToolbar,
    ImageUpload,
    Table,
    TableToolbar,
];

ClassicEditor.defaultConfig = {
    licenseKey: 'GPL',
    removePlugins: ['LicenseBanner'],
    toolbar: [
        'undo', 'redo', '|',
        'heading', '|',
        'bold', 'italic', '|',
        'blockQuote', '|',
        'bulletedList', 'numberedList', '|',
        'link', 'insertImage', 'insertTable',
    ],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6' }
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    image: {
        toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side'
        ]
    },
};

export default function Editor({ value, onChange, docId }) {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={(editor) => {

                if (!docId) {
                    const uploadCommand = editor.commands.get('imageUpload');
                    if (uploadCommand) {
                        uploadCommand.forceDisabled('no-doc');
                    }
                    return;
                }

                // Enable command and register adapter
                const uploadCommand = editor.commands.get('imageUpload');
                if (uploadCommand) {
                    uploadCommand.clearForceDisabled('no-doc');
                }

                UploadPlugin(editor, docId);
            }}

            // Keep propagating content back up into React state
            onChange={(event, editor) => {
                onChange(editor.getData());
            }}

        />
    );
}
