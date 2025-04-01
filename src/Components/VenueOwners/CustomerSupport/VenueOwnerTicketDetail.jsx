import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Card, 
    Button, 
    Input, 
    Avatar, 
    List, 
    Tag, 
    Divider, 
    message, 
    Descriptions,
    Select,
    Space,
    Badge
} from 'antd';
import { UserOutlined, MessageOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const VenueOwnerTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const [status, setStatus] = useState('open');

    useEffect(() => {
        fetchTicketDetails();
    }, [id]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/grievances/admin/tickets/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('venueOwnerToken')}`
                    }
                }
            );
            setTicket(response.data.ticket);
            setResponses(response.data.responses);
            setStatus(response.data.ticket.status);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch ticket details');
            setLoading(false);
        }
    };

    const handleSubmitResponse = async () => {
        if (!messageText.trim()) {
            message.warning('Please enter a message');
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/grievances/admin/tickets/${id}/responses`,
                { message: messageText },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('venueOwnerToken')}`
                    }
                }
            );
            setMessageText('');
            message.success('Response sent');
            fetchTicketDetails();
        } catch (error) {
            message.error('Failed to send response');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.patch(
                `http://localhost:5000/grievances/admin/tickets/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('venueOwnerToken')}`
                    }
                }
            );
            setStatus(newStatus);
            message.success('Ticket status updated');
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    if (loading) {
        return <div>Loading ticket details...</div>;
    }

    if (!ticket) {
        return <div>Ticket not found</div>;
    }

    return (
        <div className="venue-owner-ticket-detail">
            <Card
                title={`Ticket #${ticket.id}: ${ticket.subject}`}
                extra={
                    <Space>
                        <Select
                            value={status}
                            style={{ width: 150 }}
                            onChange={handleStatusChange}
                        >
                            <Option value="open">Open</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="resolved">Resolved</Option>
                        </Select>
                        <Button onClick={() => navigate('/venue-owner/tickets')}>
                            Back to Tickets
                        </Button>
                    </Space>
                }
            >
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Customer">{ticket.user_name}</Descriptions.Item>
                    <Descriptions.Item label="Priority">
                        <Tag color={
                            ticket.priority === 'low' ? 'green' :
                            ticket.priority === 'medium' ? 'blue' :
                            ticket.priority === 'high' ? 'orange' : 'red'
                        }>
                            {ticket.priority}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {new Date(ticket.created_at).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Badge 
                            status={
                                status === 'open' ? 'warning' :
                                status === 'in_progress' ? 'processing' :
                                'success'
                            }
                            text={status.replace('_', ' ')}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Description" span={2}>
                        {ticket.description}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Conversation</Divider>

                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 16px' }}>
                    <List
                        dataSource={responses}
                        renderItem={(response) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar 
                                            style={{ backgroundColor: response.is_admin ? '#1890ff' : '#52c41a' }}
                                            icon={<UserOutlined />}
                                        />
                                    }
                                    title={
                                        <span style={{ 
                                            color: response.is_admin ? '#1890ff' : '#52c41a',
                                            fontWeight: 500
                                        }}>
                                            {response.is_admin ? 'You' : ticket.user_name}
                                        </span>
                                    }
                                    description={response.message}
                                />
                            </List.Item>
                        )}
                    />
                </div>

                <Divider />

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
                        Send Response
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default VenueOwnerTicketDetail;