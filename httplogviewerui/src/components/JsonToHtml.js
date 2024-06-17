import React from 'react';

const JsonToHtml = ({ data }) => {
    const renderData = (obj) => {
        return Object.keys(obj).map((key, index) => {
            const value = obj[key];
            if (typeof value === 'object') {
                return (
                    <div key={index}>
                        <strong>{key}:</strong>
                        <div style={{ marginLeft: '20px' }}>{renderData(value)}</div>
                    </div>
                );
            } else {
                return (
                    <div key={index}>
                        <strong>{key}:</strong> {value}
                    </div>
                );
            }
        });
    };

    return <div>{renderData(data)}</div>;
};

export default JsonToHtml;