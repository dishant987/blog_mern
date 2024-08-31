import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Divider, Skeleton, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import axios from 'axios';
import moment from 'moment';
import DOMPurify from 'dompurify';
import Comment from '../comment/Comment'; // Import the Comment component

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '96px',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  marginBottom: 30,
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    marginTop: '72px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    marginTop: '60px',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '60%',
  height: 'auto',
  borderRadius: '10px',
  marginBottom: '24px',
  display: 'block',
  margin: '0 auto',
  position: 'relative',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  zIndex: 0,
  [theme.breakpoints.down('md')]: {
    width: '80%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const PostView = () => {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const { mode } = useTheme();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/singlepost/${id}`);
      setPost(response.data);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/comments`, { content: newComment, postId: id });
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  if (post === null) {
    return (
      <StyledContainer
        sx={{
          backgroundColor: mode === 'dark' ? '#1c1c1c' : '#ffffff',
          border: `1px solid ${mode === 'dark' ? '#444' : '#e0e0e0'}`,
          boxShadow: `0px 4px 8px ${mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', marginBottom: '16px' }} />
        <Skeleton variant="rectangular" sx={{ width: '40%', height: 300, marginBottom: '24px', margin: 'auto', borderRadius: '10px' }} />
        <Skeleton variant="rectangular" sx={{ height: 200, marginTop: 4, marginBottom: '16px' }} />
        <Skeleton variant="text" sx={{ width: '50%', margin: '0 auto', marginTop: '16px' }} />
      </StyledContainer>
    );
  }

  if (!post) {
    return <Typography variant="h6">Post not found!</Typography>;
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <StyledContainer
      sx={{
        backgroundColor: mode === 'dark' ? '#1c1c1c' : '#ffffff',
        border: `1px solid ${mode === 'dark' ? '#444' : '#e0e0e0'}`,
        boxShadow: `0px 4px 8px ${mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      <Title
        sx={{
          color: mode === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        {post.title}
      </Title>

      <StyledImage
        src={post.frontImage}
        alt={post.title}
      />

      <Box
        component="div"
        sx={{
          fontSize: '1rem',
          marginTop: 4,
          lineHeight: '1.6',
          paddingBottom: '16px',
          textAlign: 'justify',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: mode === 'dark' ? '#868686' : '#f5f5f5',
          color: mode === 'dark' ? '#e0e0e0' : '#000000',
          '& p': {
            color: mode === 'dark' ? '#e0e0e0' : '#000000',
          },
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      <Divider sx={{ margin: '20px 0' }} />

      <Typography
        variant="subtitle1"
        sx={{
          color: mode === 'dark' ? '#aaaaaa' : '#555555',
          textAlign: 'center',
        }}
      >
        {`Published on ${moment(post.createdAt).format('MMMM Do, YYYY')}`}
      </Typography>

      <Divider sx={{ margin: '20px 0' }} />

      {/* <Box>
        <Typography variant="h6" sx={{ marginBottom: '16px' }}>Comments:</Typography>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onLike={(commentId) => console.log(`Like comment ${commentId}`)}
            onDislike={(commentId) => console.log(`Dislike comment ${commentId}`)}
            onReply={() => fetchData()}
          />
        ))}
        <Box sx={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            sx={{ marginBottom: '8px' }}
          />
          <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
            Add Comment
          </Button>
        </Box>
      </Box> */}
    </StyledContainer>
  );
};

export default PostView;
