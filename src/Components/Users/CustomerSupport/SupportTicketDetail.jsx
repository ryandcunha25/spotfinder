import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Button, Input, Avatar } from 'antd';
import { fetchTicketDetails, postResponse } from '../../services/supportService';
import FeedbackModal from '../../components/FeedbackModal';

const SupportTicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const loadTicket = async () => {
      const data = await fetchTicketDetails(id);
      setTicket(data);
    };
    loadTicket();
  }, [id]);

  const handleSubmit = async () => {
    await postResponse(id, message);
    setMessage('');
  };

  return (
    <div className="ticket-detail">
      <Card title={`Ticket #${id}: ${ticket?.subject}`}>
        <List
          dataSource={ticket?.responses}
          renderItem={(response) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{response.is_admin ? 'A' : 'U'}</Avatar>}
                title={response.is_admin ? 'Admin' : 'You'}
                description={response.message}
              />
            </List.Item>
          )}
        />
        <Input.TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your response..."
        />
        <Button onClick={handleSubmit}>Send</Button>
        {ticket?.status === 'resolved' && (
          <Button onClick={() => setShowFeedback(true)}>Submit Feedback</Button>
        )}
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