import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Button, Input, Avatar, Badge, Tag, Divider } from 'antd';
import { fetchTicketDetails, postResponse } from '../../services/supportService';
import FeedbackModal from '../../components/FeedbackModal';
import { MessageOutlined, SendOutlined, FormOutlined } from '@ant-design/icons';

const SupportTicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true);
      try {
        const data = await fetchTicketDetails(id);
        setTicket(data);
      } finally {
        setLoading(false);
      }
    };
    loadTicket();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.responses]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await postResponse(id, message);
      const updatedTicket = await fetchTicketDetails(id);
      setTicket(updatedTicket);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-full flex flex-col">
      <Card 
        className="rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col"
        loading={loading}
        title={
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Ticket #{id}: <span className="text-blue-600">{ticket?.subject}</span>
              </h1>
              {ticket && (
                <div className="flex items-center mt-2 space-x-2">
                  <Badge 
                    status={
                      ticket.status === 'open' ? 'warning' :
                      ticket.status === 'in_progress' ? 'processing' :
                      'success'
                    }
                    className="mr-1"
                  />
                  <Tag 
                    color={
                      ticket.priority === 'low' ? 'green' :
                      ticket.priority === 'medium' ? 'blue' :
                      ticket.priority === 'high' ? 'orange' : 'red'
                    }
                    className="capitalize"
                  >
                    {ticket.priority}
                  </Tag>
                </div>
              )}
            </div>
            {ticket?.status === 'resolved' && (
              <Button 
                type="primary" 
                icon={<FormOutlined />}
                onClick={() => setShowFeedback(true)}
                className="mt-2 md:mt-0"
              >
                Submit Feedback
              </Button>
            )}
          </div>
        }
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 0 }}
      >
        <div className="flex-1 flex flex-col p-6">
          {ticket?.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Ticket Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          )}

          <Divider orientation="left" className="font-medium">Conversation</Divider>

          <div className="flex-1 overflow-y-auto mb-6 pr-2">
            <List
              dataSource={ticket?.responses}
              renderItem={(response) => (
                <List.Item className="!px-0 !py-2">
                  <div className={`flex w-full p-4 rounded-lg ${response.is_admin ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <Avatar 
                      size="large"
                      className={response.is_admin ? 'bg-blue-500' : 'bg-gray-500'}
                    >
                      {response.is_admin ? 'A' : 'U'}
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${response.is_admin ? 'text-blue-600' : 'text-gray-600'}`}>
                          {response.is_admin ? 'Support Agent' : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700 whitespace-pre-wrap">{response.message}</p>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "No messages yet" }}
            />
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-4 mt-auto">
            <Input.TextArea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your response here..."
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
            />
            <div className="flex justify-end">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                loading={sending}
                disabled={!message.trim()}
                className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-10"
              >
                Send Response
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <FeedbackModal 
        visible={showFeedback}
        onCancel={() => setShowFeedback(false)}
        ticketId={id}
      />
    </div>
  );
};

export default SupportTicketDetail;