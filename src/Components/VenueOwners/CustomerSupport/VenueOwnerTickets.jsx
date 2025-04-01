import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Table,
    Button,
    Tag,
    Space,
    Select,
    message,
    Badge,
    Modal,
    Descriptions,
    Avatar,
    List,
    Divider,
    Input,
    Spin
} from 'antd';
import { SyncOutlined, EyeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const VenueOwnerTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ticketResponses, setTicketResponses] = useState([]);
    const [responseLoading, setResponseLoading] = useState(false);
    const [messageText, setMessageText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:5000/grievances/venueowners/tickets';
            if (statusFilter !== 'all') {
                url += `?status=${statusFilter}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('venueOwnerToken')}`
                }
            });
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch tickets');
            setLoading(false);
        }
    };

    const showTicketDetails = async (ticketId) => {
        try {
            console.log(ticketId)
            setResponseLoading(true);
            const response = await axios.get(
                `http://localhost:5000/grievances/venueowners/tickets/${ticketId}`
            );

            // Verify the ID matches what you expect
            console.log("Received ticket data:", response.data.ticket);

            setSelectedTicket(response.data.ticket);
            console.log(response.data.ticket)
            setTicketResponses(response.data.responses || []);
            setIsModalVisible(true);
        } catch (error) {
            message.error('Failed to fetch ticket details');
            console.error("Error details:", error.response?.data);
        } finally {
            setResponseLoading(false);
        }
    };

    const handleSubmitResponse = async () => {
        if (!messageText.trim()) {
            message.warning('Please enter a message');
            return;
        }

        try {
            console.log(messageText)
            console.log(selectedTicket.id)
            const response = await axios.post(
                `http://localhost:5000/grievances/venueowners/tickets/${selectedTicket.id}/responses`,
                {
                    message: messageText,
                    user_id: selectedTicket.user_id  // Assuming you have the user ID in the ticket data
                },
               
            );

            if (response.data.status === 201) {
                message.success('Response submitted');
            }
            
            // Add the new response to the list
            setTicketResponses([...ticketResponses, {
                ...response.data,
                is_admin: true,
                user_name: 'You'
            }]);
            console.log(response.data.status )

            setMessageText('');
           

            // Refresh the ticket status
            const ticketResponse = await axios.get(
                `http://localhost:5000/grievances/venueowners/tickets/${selectedTicket.id}`,
            );
            setSelectedTicket(ticketResponse.data.ticket);

        } catch (error) {
            message.error('Failed to submit response');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.patch(
                `http://localhost:5000/grievances/venueowners/tickets/${selectedTicket.id}/status`,
                { status: newStatus },
            );
            setSelectedTicket({
                ...selectedTicket,
                status: newStatus
            });
            message.success('Ticket status updated');
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const formatTicketId = (id) => {
        const idStr = id.toString();
        return `#${idStr.length > 8 ? idStr.slice(-8) : idStr}`;
    };

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'id',  // Make sure this matches your actual data field
            key: 'id',
            render: (id) => <span>#{id}</span>
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Customer',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge
                    status={
                        status === 'open' ? 'warning' :
                            status === 'in_progress' ? 'processing' :
                                status === 'resolved' ? 'success' : 'default'
                    }
                    text={status.replace('_', ' ')}
                />
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag color={
                    priority === 'low' ? 'green' :
                        priority === 'medium' ? 'blue' :
                            priority === 'high' ? 'orange' : 'red'
                }>
                    {priority}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => showTicketDetails(record.id)}  // Use the correct field
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="venue-owner-tickets">
            <div className="tickets-header">
                <h2>Customer Support Tickets</h2>
                <div>
                    <Button
                        icon={<SyncOutlined />}
                        onClick={fetchTickets}
                        style={{ marginRight: 16 }}
                    >
                        Refresh
                    </Button>
                    <Select
                        defaultValue="all"
                        style={{ width: 150 }}
                        onChange={setStatusFilter}
                    >
                        <Option value="all">All Statuses</Option>
                        <Option value="open">Open</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="resolved">Resolved</Option>
                    </Select>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={tickets}
                rowKey="ticket_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Ticket Details Modal */}
            <Modal
                title={`Ticket ${selectedTicket ? formatTicketId(selectedTicket.id) : ''}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                {responseLoading ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <Spin size="large" />
                    </div>
                ) : selectedTicket && (
                    <>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Subject" span={2}>
                                {selectedTicket.subject}
                            </Descriptions.Item>
                            <Descriptions.Item label="Customer">
                                {selectedTicket.first_name} {selectedTicket.last_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Select
                                    value={selectedTicket.status}
                                    style={{ width: 150 }}
                                    onChange={handleStatusChange}
                                >
                                    <Option value="open">Open</Option>
                                    <Option value="in_progress">In Progress</Option>
                                    <Option value="resolved">Resolved</Option>
                                </Select>
                            </Descriptions.Item>
                            <Descriptions.Item label="Priority">
                                <Tag color={
                                    selectedTicket.priority === 'low' ? 'green' :
                                        selectedTicket.priority === 'medium' ? 'blue' :
                                            selectedTicket.priority === 'high' ? 'orange' : 'red'
                                }>
                                    {selectedTicket.priority}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {new Date(selectedTicket.created_at).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {selectedTicket.description}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Conversation</Divider>

                        <div style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '16px'
                        }}>
                            <List
                                dataSource={ticketResponses}
                                renderItem={(response) => (
                                    <List.Item style={{ padding: '8px 0' }}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{
                                                        backgroundColor: response.is_admin ? '#1890ff' : '#52c41a'
                                                    }}
                                                    icon={<UserOutlined />}
                                                />
                                            }
                                            title={
                                                response.is_admin ?
                                                <span style={{
                                                    color:  '#1890ff',
                                                    fontWeight: 500
                                                }}>
                                                    Support Agent
                                                </span>
                                                : <span style={{
                                                    color:  '#1890ff',
                                                    fontWeight: 500
                                                }}>
                                                    {response.first_name} {response.last_name}
                                                </span>
                                            }
                                            description={response.message}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                        <div className="response-section">
                            <h4><MessageOutlined /> Add Response</h4>
                            <TextArea
                                rows={4}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your response here..."
                            />
                            <Button
                                type="primary"
                                onClick={handleSubmitResponse}
                                style={{ marginTop: 16 }}
                                disabled={!messageText.trim()}
                            >
                                Submit Response
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default VenueOwnerTickets;