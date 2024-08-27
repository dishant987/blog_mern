import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/system';
import { useTheme } from '../Themecontext';
import { Link } from 'react-router-dom';
import StarryBackground from '../Star/StarryBackground';

const StyledCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const PostCard = styled(Box)(({ theme }) => ({
  minHeight: '250px',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[5],
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const ContentBox = styled(Box)(({ mode }) => ({
  padding: '16px',
  flex: 1,
  backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.6)' : 'rgba(245, 245, 245, 0.6)', // Semi-transparent background for glass effect
  color: mode === 'dark' ? '#fff' : '#000',
  backdropFilter: 'blur(10px)',
  transition: 'background-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out',
  '&:hover': {
    backgroundColor: mode === 'dark' ? 'rgba(51, 51, 51, 0.8)' : 'rgba(245, 245, 245, 0.8)',
    backdropFilter: 'blur(20px)',
  },
}));

const PostsList = () => {
  const [data, setData] = useState([]);
  const { mode } = useTheme(); // Access the current theme mode (light or dark)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/allpost');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StarryBackground />
      <Container sx={{ marginTop: 15 }}>
        <Grid container spacing={2}> {/* Add spacing between the grid items */}
          {data.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}> {/* Updated for 4 cards in a row */}
              <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                <StyledCard>
                  <PostCard>
                    <Box
                      component="img"
                      src={post.frontImage}
                      alt={post.title}
                      sx={{
                        height: '180px',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px 8px 0 0', // Only round top corners
                      }}
                    />
                    <ContentBox mode={mode}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: mode === 'dark' ? '#fff' : '#000',
                          textDecoration: 'none',
                          fontWeight: 'bold', // Make title bold
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === 'dark' ? '#bbb' : '#666',
                          marginTop: '8px',
                          display: 'block', // Ensure the timestamp is on a new line
                        }}
                      >
                        {moment(post.createdAt).fromNow()}
                      </Typography>
                    </ContentBox>
                  </PostCard>
                </StyledCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default PostsList;
