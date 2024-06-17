import React, { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ContentViewer from '../components/ContentViewer';
import moment from 'moment';

const HttpLogsTable = ({ logs }) => {
    const [filter, setFilter] = useState('');

    const [expandedRow, setExpandedRow] = useState(null);

    const handleToggleExpand = (index) => {
        if (expandedRow === index) {
            setExpandedRow(null);
        } else {
            setExpandedRow(index);
        }
    };

    const filteredLogs = logs.filter((log) =>
        Object.values(log).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase())
        )
    );

    return (
        <div>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Filter logs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th></th>
                        <th>Action</th>
                        <th>Method</th>
                        <th>Status Code</th>
                        <th>Reason Phrase</th>
                        <th>Content</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, index) => (
                        <React.Fragment key={index}>
                            <tr onClick={() => handleToggleExpand(index)}>
                                <td>{moment(log.dateTime).format('MMMM do yyyy, h:mm:ss a')}</td>
                                <td>{log.actionName}</td>
                                <td>{log.method}</td>
                                <td>{log.statusCode}</td>
                                <td>{log.reasonPhrase}</td>
                                <td>
                                    <ContentViewer content={log.content} action={log.actionName} />
                                </td>
                              
                                <td>
                                    {expandedRow === index ? <BsChevronUp /> : <BsChevronDown />}
                                </td>
                            </tr>
                            {expandedRow === index && (
                                <tr>
                                    <td colSpan="7">
                                        <div>
                                            <p>Request Headers: {JSON.stringify(log.requestHeaders)}</p>
                                            <p>Response Headers: {JSON.stringify(log.responseHeaders)}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HttpLogsTable;