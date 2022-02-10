import { 
  useState,
  useEffect
} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  Typography
} from '@mui/material'

import {
  Favorite,
  ModeComment,
  Send
} from '@mui/icons-material'

import {
  usePost,
  usePostsOperations
} from './../hooks'

const Home: NextPage = () => {
  const [ comment, setComment ] = useState<string>('')
  const [ updateComments, setUpdateComments ] = useState<boolean>(false)

  const post = usePost({ updateComments, setUpdateComments })
  const postsOperations = usePostsOperations()

  async function handleComment() {
    await postsOperations.addComment(String(post?.id), String(post?.author.id), comment)
    setUpdateComments(true)
  }

  async function handleLike() {
    await postsOperations.addLike(String(post?.id))
    setUpdateComments(true)
  }

  useEffect(() => {
    if (!!post?.id) {
      postsOperations.getComments(post.id)
    }
  }, [ post ])

  function renderComments() {
    if (!!post?.comments) {
      return post.comments.map((comment) => {
        return (
          <Box
            key={comment.id}
            component="div"
            sx={{
              height: '45px',
              width: '100%',

              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img 
              src={comment.author.image}
              alt="author image"
              className={styles.comment_author_image} 
            />

            <Typography variant='subtitle2'>{comment.content}</Typography>
          </Box>
        )
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Contadores distribuídos</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Card
          sx={{ width: '300px', backgroundColor: '#FFF', marginBottom: '15px' }}
        >
          <CardHeader
            avatar={
              <Avatar alt='Author image' src={post?.author.image}/>
            }
            title={post?.author.name}
            subheader={post?.author.description}
          />

          <CardMedia
            component="img"
            height="194"
            image={post?.image}
            alt="post image"
          />

          <CardContent>
            <Typography variant='body2'>
              Volto em 2022, vamos pra guerra dos mil anos!
            </Typography>
          </CardContent>

          <CardActions>
            <IconButton 
              aria-label="like post"
              onClick={() => handleLike()}
            >
              <Favorite />
            </IconButton>

            <Typography variant='subtitle2' sx={{ marginRight: '10px' }}>{!!post?.total_of_likes ? post?.total_of_likes : 0}</Typography>

            <ModeComment />

            <Typography variant='subtitle2'>{!!post?.total_of_comments ? post.total_of_comments : 0}</Typography>
          </CardActions>
        </Card>

        <Box
          component="div"
          sx={{
            height: 'fit-content',
            maxHeight: '100px',
            width: '300px',

            margin: '13px 0px',

            display: 'flex',
            flexDirection: 'column',
            gap: '5px',

            overflowY: 'scroll'
          }}
          style={{
            display: !!post?.comments && post.comments.length > 0 ? '' : 'none'
          }}
        >
          {renderComments()}
        </Box>

        <Box
          component="form"
          sx={{
            width: '300px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-name"
            label="adicione um comentário"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value)
            }}
          />

          <IconButton 
            aria-label="like post"
            onClick={() => handleComment()}
          >
            <Send />
          </IconButton>
        </Box>

      </main>
    </div>
  )
}

export default Home
