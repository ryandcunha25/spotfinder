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
    Modal,
    Descriptions,
    Avatar,
    List,
    Divider,
    Input
} from 'antd';
import { PlusOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        const user_id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        try {
            setLoading(true);
            let url = `http://localhost:5000/grievances/alltickets/${user_id}`;
            if (statusFilter !== 'all') {
                url += `?status=${statusFilter}`;
            }
            const response = await axios.get(url);
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch tickets');
            setLoading(false);
        }
    };

    const showTicketDetails = async (ticket_id) => {
        const user_id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:5000/grievances/tickets/${ticket_id}/${user_id}`);
            setSelectedTicket(response.data.ticket);
            setResponses(response.data.responses.map(r => ({
                ...r,
                is_admin: r.is_admin || false,
                message: r.message || '',
                user_name: r.is_admin ? 'Support Agent' : 'You'
            })) || []);
            setIsModalVisible(true);
        } catch (error) {
            message.error('Failed to fetch ticket details');
        }
    };

    const handleSubmitResponse = async () => {
        const user_id = localStorage.getItem('userId') || sessionStorage.getItem('userId');

        if (!messageText.trim()) {
            message.warning('Please enter a message');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/grievances/tickets/${selectedTicket.id}/${user_id}/responses`,
                { message: messageText }
            );

            const newResponse = {
                ...response.data,
                is_admin: false,
                user_name: 'You',
                message: messageText
            };

            setResponses([...responses, newResponse]);
            setMessageText('');
            message.success('Response submitted');

        } catch (error) {
            message.error('Failed to submit response');
            console.error('Error submitting response:', error);
        }
    };

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'open': color = 'orange'; break;
                    case 'in_progress': color = 'blue'; break;
                    case 'resolved': color = 'green'; break;
                    case 'closed': color = 'gray'; break;
                    default: color = 'default';
                }
                return <Tag color={color}>{status.replace('_', ' ')}</Tag>;
            },
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                let color = '';
                switch (priority) {
                    case 'low': color = 'green'; break;
                    case 'medium': color = 'blue'; break;
                    case 'high': color = 'orange'; break;
                    case 'critical': color = 'red'; break;
                    default: color = 'default';
                }
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => showTicketDetails(record.id)}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="support-tickets-container">
            <div className="tickets-header">
                <h2>Support Tickets</h2>
                <div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/user-tickets/create-ticket')}
                    >
                        New Ticket
                    </Button>
                    <Select
                        defaultValue="all"
                        style={{ width: 150, marginLeft: 16 }}
                        onChange={(value) => setStatusFilter(value)}
                    >
                        <Option value="all">All Statuses</Option>
                        <Option value="open">Open</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="resolved">Resolved</Option>
                        <Option value="closed">Closed</Option>
                    </Select>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={tickets}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Ticket Details Modal */}
<Modal
    title={`Ticket #${selectedTicket?.id}: ${selectedTicket?.subject}`}
    visible={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null}
    width={800}
    style={{ top: 20 }}
    bodyStyle={{
        height: '84vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0'
    }}
>
    {selectedTicket && (
        <>
            {/* Ticket Info Section (Fixed Height) */}
            <div style={{ 
                flex: 'none',
                padding: '0 16px',
                marginBottom: '16px',
                height: '155px',
            }}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Status" span={1}>
                        <Tag color={
                            selectedTicket.status === 'open' ? 'orange' :
                            selectedTicket.status === 'in_progress' ? 'blue' :
                            selectedTicket.status === 'resolved' ? 'green' : 'gray'
                        }>
                            {selectedTicket.status.replace('_', ' ')}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Priority" span={1}>
                        <Tag color={
                            selectedTicket.priority === 'low' ? 'green' :
                            selectedTicket.priority === 'medium' ? 'blue' :
                            selectedTicket.priority === 'high' ? 'orange' : 'red'
                        }>
                            {selectedTicket.priority}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" span={2}>
                        {new Date(selectedTicket.created_at).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description" span={2}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</div>
                    </Descriptions.Item>
                </Descriptions>
            </div>

            {/* Conversation Section (Scrollable) */}
            <div style={{ 
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 16px'
            }}>
                <Divider orientation="left" style={{ marginTop: 0 }}>Conversation</Divider>
                <div style={{ 
                    flex: 1,
                    overflowY: 'auto',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    padding: '12px',
                    backgroundColor: '#fafafa',
                    height: '100%'
                }}>
                    <List
                        dataSource={responses}
                        renderItem={(response) => (
                            <List.Item 
                                style={{ 
                                    padding: '12px',
                                    marginBottom: '8px',
                                    backgroundColor: '#fff',
                                    borderRadius: '4px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
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
                                        <div style={{ 
                                            fontWeight: 500,
                                            color: response.is_admin ? '#1890ff' : '#52c41a'
                                        }}>
                                            {response.user_name}
                                        </div>
                                    }
                                    description={
                                        <div style={{ whiteSpace: 'pre-wrap' }}>
                                            {response.message}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            {/* Response Section (Fixed Height) */}
            <div style={{ 
                flex: 'none',
                padding: '16px',
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fff'
            }}>
                <h4 style={{ marginBottom: '12px' }}>
                    <MessageOutlined style={{ marginRight: '8px' }} />
                    Add Response
                </h4>
                <TextArea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your response here..."
                    style={{ marginBottom: '12px' }}
                />
                <Button
                    type="primary"
                    onClick={handleSubmitResponse}
                    disabled={!messageText.trim()}
                    style={{ width: '100%' }}
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

export default SupportTickets;