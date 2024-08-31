import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Divider } from '@mui/material';
import { ThumbUp, ThumbDown, Reply } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../Themecontext';

const Comment = ({ comment, onLike, onDislike, onReply }) => {
  const { mode } = useTheme();
  const [replyContent, setReplyContent] = useState('');

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/comments/${comment._id}/reply`, { content: replyContent });
      onReply();
      setReplyContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: mode === 'dark' ? '#2c2c2c' : '#f0f0f0',
        color: mode === 'dark' ? '#e0e0e0' : '#000000',
      }}
    >
      <Typography variant="body1">{comment.content}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
        <IconButton onClick={() => onLike(comment._id)} color="primary">
          <ThumbUp />
        </IconButton>
        <IconButton onClick={() => onDislike(comment._id)} color="secondary">
          <ThumbDown />
        </IconButton>
        <IconButton onClick={() => setReplyContent('')} color="default">
          <Reply />
        </IconButton>
      </Box>
      {replyContent && (
        <Box sx={{ marginTop: '16px' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={replyContent}
            onChange={handleReplyChange}
            placeholder="Write a reply..."
            sx={{ marginBottom: '8px' }}
          />
          <Button variant="contained" color="primary" onClick={handleReplySubmit}>
            Reply
          </Button>
        </Box>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Box key={reply._id} sx={{ padding: '8px 16px', marginTop: '8px', backgroundColor: mode === 'dark' ? '#3c3c3c' : '#e0e0e0' }}>
          <Typography variant="body2">{reply.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Comment;
