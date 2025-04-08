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
import Sidebar from '../Sidebar';

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
            console.log(response.data)
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch tickets');
            setLoading(false);
        }
    };

    const showTicketDetails = async (ticketId) => {
        try {
            setResponseLoading(true);
            const response = await axios.get(
                `http://localhost:5000/grievances/venueowners/tickets/${ticketId}`
            );
            setSelectedTicket(response.data.ticket);
            console.log("Ticket details:", response.data.ticket);
            setTicketResponses(response.data.responses || []);
            console.log("Ticket responses:", response.data.responses);
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
            const response = await axios.post(
                `http://localhost:5000/grievances/venueowners/tickets/${ticketResponses[0].ticket_id}/responses`,
                {
                    message: messageText,
                    user_id: selectedTicket.user_id
                },
            );

            console.log("Response data:", response.data);

            // if (response.data.status === 200) {
                message.success('Response submitted');
            // }

            setTicketResponses([...ticketResponses, {
                ...response.data,
                is_admin: true,
                user_name: 'You'
            }]);

            setMessageText('');

            const ticketResponse = await axios.get(
                `http://localhost:5000/grievances/venueowners/tickets/${ticketResponses[0].ticket_id}`,
            );
            setSelectedTicket(ticketResponse.data.ticket);

        } catch (error) {
            message.error('Failed to submit response');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.patch(
                `http://localhost:5000/grievances/venueowners/tickets/${ticketResponses[0].ticket_id}/status`,
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
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span className="font-mono">#{id}</span>
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (text) => <span className="font-medium">{text}</span>
        },
        {
            title: 'Customer',
            dataIndex: 'first_name',
            key: 'first_name',
            render: (text, record) => (
                <span className="font-medium">{text} {record.last_name}</span>
            )
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
                    text={<span className="capitalize">{status.replace('_', ' ')}</span>}
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
                } className="capitalize">
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
                        onClick={() => showTicketDetails(record.id)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="ml-64 flex-1 p-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Customer Support Tickets</h2>
                        <div className="flex items-center space-x-4">
                            <Button
                                icon={<SyncOutlined />}
                                onClick={fetchTickets}
                                className="flex items-center bg-white border border-gray-300 hover:bg-gray-50"
                            >
                                Refresh
                            </Button>
                            <Select
                                defaultValue="all"
                                style={{ width: 150 }}
                                onChange={setStatusFilter}
                                className="w-40"
                            >
                                <Option value="all">All Statuses</Option>
                                <Option value="open">Open</Option>
                                <Option value="in_progress">In Progress</Option>
                                <Option value="resolved">Resolved</Option>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <Table
                            columns={columns}
                            dataSource={tickets}
                            rowKey="ticket_id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            className="rounded-lg"
                            rowClassName="hover:bg-gray-50"
                        />
                    </div>
                </div>

                {/* Ticket Details Modal */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-xl font-semibold">Ticket {selectedTicket ? formatTicketId(ticketResponses[0].ticket_id) : ''}</span>
                        </div>
                    }
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={800}
                    className="top-5"
                    bodyStyle={{ padding: 0 }}
                >
                    {responseLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" />
                        </div>
                    ) : selectedTicket && (
                        <div className="space-y-6">
                            <div className="px-6 pt-6">
                                <Descriptions bordered column={2} className="custom-descriptions">
                                    <Descriptions.Item label="Subject" span={2} className="font-medium">
                                        {selectedTicket.subject}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Customer" className="font-medium">
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
                                        } className="capitalize">
                                            {selectedTicket.priority}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Created At">
                                        {new Date(selectedTicket.created_at).toLocaleString()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Description" span={2} className="whitespace-pre-wrap">
                                        {selectedTicket.description}
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>

                            <Divider className="my-0" />

                            <div className="px-6">
                                <h4 className="text-lg font-semibold mb-4">Conversation</h4>
                                
                                <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto bg-gray-50">
                                    <List
                                        dataSource={ticketResponses}
                                        renderItem={(response) => (
                                            <List.Item className="!px-0 !py-3">
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            className={response.is_admin ? "bg-blue-500" : "bg-green-500"}
                                                            icon={<UserOutlined />}
                                                        />
                                                    }
                                                    title={
                                                        <span className={response.is_admin ? "text-blue-600 font-medium" : "text-green-600 font-medium"}>
                                                            {response.is_admin ? 'Support Agent' : `${response.first_name} ${response.last_name}`}
                                                        </span>
                                                    }
                                                    description={
                                                        <div className="whitespace-pre-wrap text-gray-700">
                                                            {response.message}
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {new Date(response.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    }
                                                    className="items-start"
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <h4 className="text-lg font-semibold mb-3 flex items-center">
                                    <MessageOutlined className="mr-2" />
                                    Add Response
                                </h4>
                                <TextArea
                                    rows={4}
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your response here..."
                                    className="border-gray-300 hover:border-blue-400 focus:border-blue-500"
                                />
                                <Button
                                    type="primary"
                                    onClick={handleSubmitResponse}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                    disabled={!messageText.trim()}
                                >
                                    Submit Response
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default VenueOwnerTickets;   