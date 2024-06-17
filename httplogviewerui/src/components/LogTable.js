import React, { useState, useEffect } from 'react';
import ContentViewer from '../components/ContentViewer';
import { JsonToTable } from "react-json-to-table";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
    Button,
    ButtonGroup,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    PaginationItem
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, CheckCircle, Warning, Error, Search, Public, OpenInNew, FirstPage, LastPage } from '@mui/icons-material';
import axios from 'axios';

const LogTable = () => {
    const [logs, setLogs] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [viewMode, setViewMode] = useState({}); // State to manage view modes for each log
    const [clientNames, setClientNames] = useState([]);
    const [selectedClient, setSelectedClient] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        // Fetch logs
        axios.get('https://localhost:7161/api/HttpLog') // Adjust the endpoint as necessary
            .then(response => {
                setLogs(response.data);
                // Initialize viewMode for each log with 'Parsed' as default
                const initialViewMode = response.data.reduce((acc, log) => {
                    acc[log.id] = { request: 'Parsed', response: 'Parsed' };
                    return acc;
                }, {});
                setViewMode(initialViewMode);
            })
            .catch(error => {
                console.error('Error fetching logs:', error);
            });

        // Fetch HTTP Client Names
        axios.get('https://localhost:7161/api/HttpClientNames') // Adjust the endpoint as necessary
            .then(response => {
                setClientNames(response.data);
            })
            .catch(error => {
                console.error('Error fetching client names:', error);
            });
    }, []);

    const handleRowClick = (id) => {
        setExpandedRow(prevExpandedRow => (prevExpandedRow === id ? null : id));
    };

    const getRowColor = (index) => {
        return index % 2 === 0 ? 'white' : 'whitesmoke'; // Apply different colors for even and odd rows
    };

    const getStatusIcon = (statusCode) => {
        if (statusCode >= 200 && statusCode < 300) {
            return <CheckCircle style={{ color: 'green' }} />;
        } else if (statusCode >= 400 && statusCode < 500) {
            return <Warning style={{ color: 'orange' }} />;
        } else if (statusCode >= 500) {
            return <Error style={{ color: 'red' }} />;
        } else {
            return null;
        }
    };

    const handleViewModeChange = (id, type, mode) => {
        setViewMode(prevViewMode => ({
            ...prevViewMode,
            [id]: {
                ...prevViewMode[id],
                [type]: mode,
            },
        }));
    };

    const handleSearch = () => {
        axios.get(`https://localhost:7161/api/BotTracking/search`, { params: { clientName: selectedClient, query: searchQuery } })
            .then(response => {
                setLogs(response.data);
            })
            .catch(error => {
                console.error('Error searching logs:', error);
            });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1); // Reset to first page on items per page change
    };

    // Paginate logs
    const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <TableContainer component={Paper} style={{ margin: '0 auto', overflowX: 'visible', marginTop: '25px', boxShadow: '0px 12px 16px rgba(0, 0, 0, 0.1)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
                <FormControl variant="outlined" style={{ minWidth: 200, height: '40px' }}>
                    <InputLabel id="client-name-label" shrink={true} style={{ backgroundColor: "white", "paddingRight": "10px" }}>
                        <Box display="flex" alignItems="center">
                            <Public style={{ marginRight: '8px' }} />
                            HTTP Client Name
                        </Box>
                    </InputLabel>
                    <Select
                        labelId="client-name-label"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        label="HTTP Client Name"
                        style={{ height: '40px' }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {clientNames.map(client => (
                            <MenuItem key={client} value={client}>{client}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box display="flex" alignItems="center">
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search style={{ marginRight: '8px' }} />,
                        }}
                        style={{ height: '40px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '8px', height: '38px' }}>
                        Search
                    </Button>
                </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
                <Box display="flex" alignItems="center">
                    <Typography>Items per page:</Typography>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 60, marginLeft: '8px' }}>
                        <Select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Pagination
                    count={Math.ceil(logs.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            components={{ first: FirstPage, last: LastPage }}
                            {...item}
                        />
                    )}
                    showFirstButton
                    showLastButton
                />
            </Box>


            <Table>
                <TableHead style={{ backgroundColor: "#dece9d" }}>
                    <TableRow>
                        <TableCell />
                        <TableCell>URI</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Status Code</TableCell>
                        <TableCell>Action Date Time</TableCell>
                        <TableCell />
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedLogs.map((log, index) => (
                        <React.Fragment key={log.id}>
                            <TableRow style={{ backgroundColor: getRowColor(index) }}>
                                <TableCell>{getStatusIcon(log.statusCode)}</TableCell>
                                <TableCell>{log.uri}</TableCell>
                                <TableCell>{log.method}</TableCell>
                                <TableCell>{log.statusCode}</TableCell>
                                <TableCell>{new Date(log.actionDateTime).toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleRowClick(log.id)}>
                                        {expandedRow === log.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="secondary" onClick={handleSearch} size="small" endIcon={<OpenInNew />}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow style={{ backgroundColor: getRowColor(index) }}>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                    <Collapse in={expandedRow === log.id} timeout="auto" unmountOnExit>
                                        <Box margin={1} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box style={{ display: 'flex' }}>
                                                <Box style={{ flexBasis: '50%', paddingRight: '1rem' }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Request
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Headers</strong>
                                                        <hr />
                                                        <JsonToTable json={log.requestHeaders} />
                                                    </Typography>
                                                </Box>
                                                <Box style={{ flexBasis: '50%' }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Response
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Headers</strong>
                                                        <hr />
                                                        <JsonToTable json={log.responseHeaders} />
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box style={{ display: 'flex' }}>
                                                <Box style={{ flexBasis: '50%', paddingRight: '1rem' }}>
                                                    <br />
                                                    <Typography variant="body2">
                                                        <strong>Body</strong>
                                                        <ButtonGroup variant="text" size="small" style={{ float: 'right' }}>
                                                            <Button
                                                                variant={viewMode[log.id]?.request === 'Parsed' ? 'contained' : 'outlined'}
                                                                onClick={() => handleViewModeChange(log.id, 'request', 'Parsed')}
                                                            >
                                                                Parsed
                                                            </Button>
                                                            <Button
                                                                variant={viewMode[log.id]?.request === 'Raw' ? 'contained' : 'outlined'}
                                                                onClick={() => handleViewModeChange(log.id, 'request', 'Raw')}
                                                            >
                                                                Raw
                                                            </Button>
                                                        </ButtonGroup>
                                                        <hr />
                                                        {viewMode[log.id]?.request === 'Raw' ? (
                                                            <Box style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
                                                                {log.requestBody}
                                                            </Box>
                                                        ) : (
                                                            <ContentViewer content={log.requestBody} />
                                                        )}
                                                    </Typography>
                                                </Box>
                                                <Box style={{ flexBasis: '50%' }}>
                                                    <br />
                                                    <Typography variant="body2">
                                                        <strong>Body</strong>
                                                        <ButtonGroup variant="text" size="small" style={{ float: 'right' }}>
                                                            <Button
                                                                variant={viewMode[log.id]?.response === 'Parsed' ? 'contained' : 'outlined'}
                                                                onClick={() => handleViewModeChange(log.id, 'response', 'Parsed')}
                                                            >
                                                                Parsed
                                                            </Button>
                                                            <Button
                                                                variant={viewMode[log.id]?.response === 'Raw' ? 'contained' : 'outlined'}
                                                                onClick={() => handleViewModeChange(log.id, 'response', 'Raw')}
                                                            >
                                                                Raw
                                                            </Button>
                                                        </ButtonGroup>
                                                        <hr />
                                                        {viewMode[log.id]?.response === 'Raw' ? (
                                                            <Box style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
                                                                {log.responseBody}
                                                            </Box>
                                                        ) : (
                                                            <ContentViewer content={log.responseBody} action='jello' />
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
                <Box display="flex" alignItems="center">
                    <Typography>Items per page:</Typography>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 60, marginLeft: '8px' }}>
                        <Select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Pagination
                    count={Math.ceil(logs.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            components={{ first: FirstPage, last: LastPage }}
                            {...item}
                        />
                    )}
                    showFirstButton
                    showLastButton
                />
            </Box>


        </TableContainer>
    );
};

export default LogTable;
