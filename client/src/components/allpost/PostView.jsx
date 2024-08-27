import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import axios from 'axios';
import { motion } from 'framer-motion';
import moment from 'moment';
import DOMPurify from 'dompurify';

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

const StyledImage = styled(motion.img)(({ theme }) => ({
  width: '60%',
  height: 'auto',
  borderRadius: '10px',
  marginBottom: '24px',
  display: 'block',
  margin: '0 auto',
  position: 'relative',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-5px',
    left: '-5px',
    right: '-5px',
    bottom: '-5px',
    borderRadius: '15px',
    border: '2px solid transparent',
    backgroundImage: `linear-gradient(white, white), linear-gradient(45deg, rgba(255,255,255,0.5), rgba(255,255,255,0))`,
    backgroundSize: '200% 200%',
    backgroundPosition: '0% 0%',
    animation: 'shimmer 2s infinite',
    zIndex: 1,
  },
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
  const { id } = useParams();
  const { mode } = useTheme();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/singlepost/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (post === null) {
    return <Typography variant="h6">Loading...</Typography>;
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title
          sx={{
            color: mode === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          {post.title}
        </Title>
      </motion.div>

      <StyledImage
        src={post.frontImage}
        alt={post.title}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
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
    </StyledContainer>
  );
};

export default PostView;
