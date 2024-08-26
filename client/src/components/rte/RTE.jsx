import React, { useState, useEffect } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from '@mui/material';
import { useTheme } from '../Themecontext';

const RTE = ({ name, label, value, onChange, defaultValue = "" }) => {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { mode } = useTheme(); // Get current theme mode

    useEffect(() => {
        const timer = setTimeout(() => {
            setEditorLoaded(true);
        }, 1000); // Simulate a delay for loading

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);


    const contentStyle = `
        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 14px;
            background-color: ${mode === 'dark' ? '#333' : '#fff'};
            color: ${mode === 'dark' ? '#fff' : '#000'};
        }
    `;

    return (
        <div className="w-full">
            {label && (
                <label className={`inline-block mb-1 pl-1 ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
                    {label}
                </label>
            )}
            {editorLoaded ? (
                <Editor
                    apiKey={import.meta.env.VITE_TINY_API}
                    initialValue={defaultValue}
                    value={value}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "image",
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                        content_style: contentStyle,
                    }}
                    onEditorChange={(content) => onChange(name, content)}
                />
            ) : (
                <Skeleton variant="rectangular" height={500} sx={{ bgcolor: mode === 'dark' ? 'grey.800' : 'grey.300' }} />
            )}
        </div>
    );
};

export default RTE;
