import React, { useState, useEffect } from 'react';
import HtmlJsonTable from "react-json-to-html-table";
import MultipartViewer from "../components/contentviwers/MultipartViewer.js";

const ContentViewer = ({ content }) => {
    const renderContent = () => {
        const isJsonString = (str) => {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        const isMultipartData = (str) => {
            // Regular expression to check if the string has multipart headers
            const multipartRegex = /^Content-Type: .+[\r\n]+Content-Disposition: .+[\r\n]+/im;
            return multipartRegex.test(str);
        };


        if (isJsonString(content)) {
            const parsedContent = JSON.parse(content);
            return <HtmlJsonTable data={parsedContent} className="table table-sm table-striped table-bordered table-responsive" />
        }

        if (isMultipartData(content)) {
            return <MultipartViewer multipartDataString={content} />;
        }

        return <p>{content}</p>;
    };


    return (
        <React.Fragment>
            {renderContent()}
        </React.Fragment>
    );
};

export default ContentViewer;