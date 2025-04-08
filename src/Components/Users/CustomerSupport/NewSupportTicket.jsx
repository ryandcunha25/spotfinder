import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, message, Upload, Spin, Card, Row, Col } from 'antd';
import { UploadOutlined, InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const NewSupportTicket = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://84fa-115-98-235-107.ngrok-free.app/grievances/categories');
            setCategories(response.data);
        } catch (error) {
            message.error('Failed to load categories');
        }
    };

    const onFinish = async (values) => {
        const userId = localStorage.getItem('userId');
        try {
            setLoading(true);
            const response = await axios.post('https://84fa-115-98-235-107.ngrok-free.app/grievances/ticket', {
                ...values,
                category_id: selectedCategory,
                user_id: userId
            });
            
            message.success('Ticket created successfully!');
            
            if (fileList.length > 0) {
                await uploadFiles(response.data.id);
            }
            
            navigate(`/user-tickets`);
        } catch (error) {
            message.error('Failed to create ticket');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadFiles = async (ticketId) => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file);
        });
        
        try {
            setUploading(true);
            await axios.post(`https://84fa-115-98-235-107.ngrok-free.app/grievances/tickets/${ticketId}/attachments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Files uploaded successfully');
        } catch (error) {
            message.error('File upload failed');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const beforeUpload = (file) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('File must be smaller than 5MB!');
        }
        return isLt5M;
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        const category = categories.find(c => c.id === value);
        if (category) {
            form.setFieldsValue({
                priority: category.default_priority
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="flex items-start mb-8">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/user-tickets')}
                    className="flex items-center text-gray-600 hover:text-blue-600 mr-4 -ml-2"
                >
                    Back
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Create New Support Ticket</h1>
                    <p className="text-gray-500 text-sm md:text-base">
                        Fill out the form below and our team will assist you shortly
                    </p>
                </div>
            </div>

            <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Ticket Information</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Please provide detailed information about your issue
                    </p>
                </div>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ priority: 'medium' }}
                    className="p-6"
                >
                    <Row gutter={24}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="subject"
                                label={<span className="block text-sm font-medium text-gray-700 mb-1">Subject</span>}
                                rules={[{ required: true, message: 'Please enter a subject' }]}
                            >
                                <Input 
                                    placeholder="Briefly describe your issue" 
                                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 h-11"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="category_id"
                                label={<span className="block text-sm font-medium text-gray-700 mb-1">Category</span>}
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select
                                    placeholder="Select issue category"
                                    onChange={handleCategoryChange}
                                    className="w-full rounded-lg border-gray-300 hover:border-blue-400 h-11"
                                    dropdownClassName="rounded-lg"
                                >
                                    {categories.map(category => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="booking_id"
                        label={<span className="block text-sm font-medium text-gray-700 mb-1">Booking Reference (optional)</span>}
                    >
                        <Input 
                            placeholder="Enter booking ID if applicable" 
                            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 h-11"
                        />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="priority"
                                label={<span className="block text-sm font-medium text-gray-700 mb-1">Priority</span>}
                            >
                                <Select 
                                    className="rounded-lg border-gray-300 hover:border-blue-400 h-11"
                                    dropdownClassName="rounded-lg"
                                >
                                    <Option value="low">Low</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="high">High</Option>
                                    <Option value="critical">Critical</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            {selectedCategory && (
                                <div className="flex items-center h-full text-blue-600 bg-blue-50 rounded-lg p-3">
                                    <InfoCircleOutlined className="mr-2 text-blue-500" />
                                    <span className="text-sm">
                                        Estimated resolution: ~
                                        {categories.find(c => c.id === selectedCategory)?.estimated_resolution_days || 3} days
                                    </span>
                                </div>
                            )}
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label={<span className="block text-sm font-medium text-gray-700 mb-1">Description</span>}
                        rules={[{ required: true, message: 'Please describe your issue in detail' }]}
                    >
                        <TextArea 
                            rows={6} 
                            placeholder="Describe your issue in detail..." 
                            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                        />
                    </Form.Item>
{/* 
                    <Form.Item 
                        label={<span className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</span>}
                        className="mb-8"
                    >
                        <Upload
                            beforeUpload={beforeUpload}
                            fileList={fileList}
                            onChange={handleFileChange}
                            multiple
                            className="w-full"
                        >
                            <Button 
                                icon={<UploadOutlined />} 
                                className="flex items-center border border-gray-300 rounded-lg hover:bg-gray-50 h-11"
                            >
                                Select Files
                            </Button>
                        </Upload>
                        <div className="text-xs text-gray-500 mt-2">
                            Supported formats: JPG, PNG, PDF (max 5MB per file)
                        </div>
                    </Form.Item> */}

                    <div className="flex justify-end border-t border-gray-100 pt-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading || uploading}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 h-11 px-8 font-medium shadow-sm"
                            size="large"
                        >
                            Submit Ticket
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default NewSupportTicket;