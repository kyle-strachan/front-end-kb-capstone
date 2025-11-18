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

// Editor build

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
    }
};

export default function Editor({ value, onChange }) {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => {
                onChange(editor.getData());
            }}
        // disableTwoWayDataBinding
        />
    );
}
