import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, message, Upload, Spin, Card, Row, Col } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';

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
            const response = await axios.get('http://localhost:5000/grievances/categories');
            setCategories(response.data);
            console.log(response.data) // Log the categories to check the response structure
        } catch (error) {
            message.error('Failed to load categories');
        }
    };

    const onFinish = async (values) => {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        try {
            setLoading(true);
            console.log(values);
            const response = await axios.post('http://localhost:5000/grievances/ticket', {
                ...values,
                category_id: selectedCategory,
                user_id: userId
            });
            
            message.success('Ticket created successfully!');
            
            // Handle file uploads if any
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
            await axios.post(`http://localhost:5000/grievances/tickets/${ticketId}/attachments`, formData, {
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
        <div className="new-ticket-container">
            <h2>Create New Support Ticket</h2>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ priority: 'medium' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="subject"
                                label="Subject"
                                rules={[{ required: true, message: 'Please enter a subject' }]}
                            >
                                <Input placeholder="Briefly describe your issue" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="category_id"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select
                                    placeholder="Select issue category"
                                    onChange={handleCategoryChange}
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
                        label="Booking Reference (optional)"
                    >
                        <Input placeholder="Enter booking ID if applicable" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="priority"
                                label="Priority"
                            >
                                <Select>
                                    <Option value="low">Low</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="high">High</Option>
                                    <Option value="critical">Critical</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {selectedCategory && (
                                <div className="resolution-estimate">
                                    <InfoCircleOutlined /> Estimated resolution: ~
                                    {categories.find(c => c.id === selectedCategory)?.estimated_resolution_days || 3} days
                                </div>
                            )}
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please describe your issue in detail' }]}
                    >
                        <TextArea rows={6} placeholder="Describe your issue in detail..." />
                    </Form.Item>

                    <Form.Item label="Attachments (optional)">
                        <Upload
                            beforeUpload={beforeUpload}
                            fileList={fileList}
                            onChange={handleFileChange}
                            multiple
                        >
                            <Button icon={<UploadOutlined />}>Select Files</Button>
                        </Upload>
                        <div className="upload-hint">
                            Upload screenshots or documents to help us understand your issue (max 5MB per file)
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading || uploading}>
                            Submit Ticket
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default NewSupportTicket;