import React, { useState, useEffect } from 'react';
import { Download } from '@mui/icons-material';

// Function to parse multipart data
const parseMultipartData = (data) => {
    const boundary = data.split('\r\n')[0];
    const parts = data.split(boundary).filter(part => part.trim() !== '--' && part.trim() !== '');

    const parsedData = parts.map(part => {
        const [header, ...bodyParts] = part.split('\r\n\r\n');
        const body = bodyParts.join('\r\n\r\n').trim();
        const headers = header.split('\r\n').reduce((acc, line) => {
            const [key, value] = line.split(': ');
            if (key && value) acc[key.toLowerCase()] = value;
            return acc;
        }, {});
        return { headers, body };
    });

    return { boundary, parts: parsedData };
};

// Function to generate a blob URL for downloading files
const createBlobUrl = (content, contentType) => {
    const blob = new Blob([content], { type: contentType });
    return URL.createObjectURL(blob);
};

// MultipartViewer component
const MultipartViewer = ({ multipartDataString }) => {
    const [parsedData, setParsedData] = useState(null);

    useEffect(() => {
        if (multipartDataString) {
            const parsed = parseMultipartData(multipartDataString);
            setParsedData(parsed);
        }
    }, [multipartDataString]);

    return (
        <div>
            {parsedData && (
                <div>
                    <h3>Boundary: {parsedData.boundary}</h3>
                    {parsedData.parts.map((part, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                            <h4>Part {index + 1}</h4>
                            <p><strong>Content-Type:</strong> {part.headers['content-type']}</p>
                            <p><strong>Content-Disposition:</strong> {part.headers['content-disposition']}</p>
                            {part.headers['content-disposition'] && part.headers['content-disposition'].includes('filename=') ? (
                                <div>
                                    <Download />
                                    <a
                                        href={createBlobUrl(part.body, part.headers['content-type'])}
                                        download={part.headers['content-disposition'].match(/filename="(.+)"/)[1]}
                                    >
                                        {part.headers['content-disposition'].match(/filename="(.+)"/)[1]}
                                    </a>
                                </div>
                            ) : (
                                <p>{part.body}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultipartViewer;
