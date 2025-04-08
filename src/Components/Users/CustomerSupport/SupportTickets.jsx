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
    Input,
    Card,
    Typography,
    Badge,
    Popconfirm,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    MessageOutlined,
    UserOutlined,
    CloseOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    ExclamationOutlined,
    InfoOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        const user_id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        try {
            setLoading(true);
            let url = `https://84fa-115-98-235-107.ngrok-free.app/grievances/alltickets/${user_id}`;
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
            const response = await axios.get(`https://84fa-115-98-235-107.ngrok-free.app/grievances/tickets/${ticket_id}/${user_id}`);
            setSelectedTicket(response.data.ticket);
            console.log(response.data.responses)
            setResponses(response.data.responses.map(r => ({
                ...r,
                // Keep the original is_admin value from API
                is_admin: r.is_admin, // Don't modify this
                message: r.message || '',
                // Determine user_name based on is_admin
                user_name: r.is_admin ? 'Support Agent' : 'You',
                created_at: r.created_at || new Date().toISOString()
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

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `https://84fa-115-98-235-107.ngrok-free.app/grievances/tickets/${selectedTicket.id}/${user_id}/responses`,
                { message: messageText }
            );

            const newResponse = {
                ...response.data,
                is_admin: false, // This should match what your API expects for user messages
                user_name: 'You',
                message: messageText,
                created_at: new Date().toISOString()
            };

            setResponses([...responses, newResponse]);
            setMessageText('');
            message.success('Response submitted');

            if (selectedTicket.status === 'closed' || selectedTicket.status === 'resolved') {
                const updatedTicket = { ...selectedTicket, status: 'in_progress' };
                setSelectedTicket(updatedTicket);
                setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            }

        } catch (error) {
            message.error('Failed to submit response');
            console.error('Error submitting response:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCloseTicket = async () => {
        const user_id = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        try {
            await axios.patch(
                `https://84fa-115-98-235-107.ngrok-free.app/grievances/tickets/${selectedTicket.id}/${user_id}/close`
            );

            const updatedTicket = { ...selectedTicket, status: 'closed' };
            setSelectedTicket(updatedTicket);
            setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            message.success('Ticket closed successfully');
        } catch (error) {
            message.error('Failed to close ticket');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <ExclamationOutlined style={{ color: '#faad14' }} />;
            case 'in_progress': return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
            case 'resolved': return <CheckOutlined style={{ color: '#52c41a' }} />;
            case 'closed': return <CloseOutlined style={{ color: '#d9d9d9' }} />;
            default: return <InfoOutlined />;
        }
    };

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => <Text strong>#{id}</Text>
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => showTicketDetails(record.id)}
                    style={{ padding: 0, textAlign: 'left' }}
                >
                    <Text strong>{text}</Text>
                </Button>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => (
                <Badge
                    status={
                        status === 'open' ? 'warning' :
                            status === 'in_progress' ? 'processing' :
                                status === 'resolved' ? 'success' : 'default'
                    }
                    text={
                        <span style={{ textTransform: 'capitalize' }}>
                            {status.replace('_', ' ')}
                        </span>
                    }
                />
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            render: (priority) => {
                let color = '';
                let icon = null;

                switch (priority) {
                    case 'low':
                        color = 'green';
                        icon = <InfoOutlined />;
                        break;
                    case 'medium':
                        color = 'blue';
                        icon = <ExclamationOutlined />;
                        break;
                    case 'high':
                        color = 'orange';
                        icon = <ExclamationOutlined />;
                        break;
                    case 'critical':
                        color = 'red';
                        icon = <ExclamationOutlined />;
                        break;
                    default:
                        color = 'default';
                }

                return (
                    <Tag
                        color={color}
                        icon={icon}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {priority}
                    </Tag>
                );
            },
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (date) => (
                <Tooltip title={new Date(date).toLocaleString()}>
                    <Text type="secondary">{formatDate(date)}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        onClick={() => showTicketDetails(record.id)}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="support-tickets-container" style={{ padding: '24px' }}>
            <Card
                title={<Title level={4} style={{ margin: 0 }}>Support Tickets</Title>}
                extra={
                    <Space>
                        <Select
                            defaultValue="all"
                            style={{ width: 180 }}
                            onChange={(value) => setStatusFilter(value)}
                        >
                            <Option value="all">All Statuses</Option>
                            <Option value="open">Open</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="resolved">Resolved</Option>
                            <Option value="closed">Closed</Option>
                        </Select>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/user-tickets/create-ticket')}
                        >
                            New Ticket
                        </Button>
                    </Space>
                }
                bordered={false}
                style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
            >
                <Table
                    columns={columns}
                    dataSource={tickets}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} tickets`
                    }}
                    scroll={{ x: 'max-content' }}
                    style={{ marginTop: '16px' }}
                />
            </Card>

            {/* Ticket Details Modal */}
            <Modal
                title={
                    <Space>
                        {selectedTicket && getStatusIcon(selectedTicket.status)}
                        <span>Ticket #{selectedTicket?.id}: {selectedTicket?.subject}</span>
                    </Space>
                }
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
                destroyOnClose
            >
                {selectedTicket && (
                    <>
                        {/* Ticket Info Section (Fixed Height) */}
                        <div style={{
                            flex: 'none',
                            padding: '0 16px',
                            marginBottom: '16px',
                        }}>
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Status" span={1}>
                                    <Space>
                                        {getStatusIcon(selectedTicket.status)}
                                        <Text style={{ textTransform: 'capitalize' }}>
                                            {selectedTicket.status.replace('_', ' ')}
                                        </Text>
                                    </Space>
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
                                <Descriptions.Item label="Created" span={2}>
                                    {new Date(selectedTicket.created_at).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Description" span={2}>
                                    <div style={{
                                        whiteSpace: 'pre-wrap',
                                        padding: '8px 0',
                                        lineHeight: 1.6
                                    }}>
                                        {selectedTicket.description}
                                    </div>
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
        <List.Item style={{ padding: '12px', marginBottom: '8px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <List.Item.Meta
                avatar={
                    <Avatar 
                        style={{ 
                            backgroundColor: !response.is_admin ? '#52c41a' : '#1890ff'
                        }}
                        icon={<UserOutlined />}
                    />
                }
                title={
                    <Space>
                        <Text strong style={{ color: !response.is_admin ? '#52c41a' : '#1890ff' }}>
                            {response.user_name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.8em' }}>
                            {formatDate(response.created_at)}
                        </Text>
                    </Space>
                }
                description={
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: '4px' }}>
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
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong>
                                    <MessageOutlined style={{ marginRight: '8px' }} />
                                    Add Response
                                </Text>
                                <TextArea
                                    rows={3}
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your response here..."
                                    style={{ marginBottom: '12px' }}
                                    maxLength={1000}
                                    showCount
                                />
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    {selectedTicket.status !== 'closed' && (
                                        <Popconfirm
                                            title="Are you sure you want to close this ticket?"
                                            onConfirm={handleCloseTicket}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button>
                                                Close Ticket
                                            </Button>
                                        </Popconfirm>
                                    )}
                                    <Button
                                        type="primary"
                                        onClick={handleSubmitResponse}
                                        disabled={!messageText.trim()}
                                        loading={isSubmitting}
                                        style={{ minWidth: '150px' }}
                                    >
                                        Submit Response
                                    </Button>
                                </Space>
                            </Space>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default SupportTickets;