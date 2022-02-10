import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  DocumentData, 
  updateDoc,
  increment,
  writeBatch,
} from 'firebase/firestore'

import { firebaseOptions } from './../config'

import {
  usePostsOperations
} from './'

interface CommentInterface {
  id: string
  content: string
  author: {
    id: string,
    name: string,
    description: string,
    image: string
  },
}

interface PostInterface {
  id: string,
  content: string,
  image: string,
  author: {
    id: string,
    name: string,
    description: string,
    image: string
  },
  comments?: CommentInterface[],
  total_of_comments?: number,
  total_of_likes?: number
}


interface Params {
  updateComments?: boolean,
  setUpdateComments?: Dispatch<SetStateAction<boolean>>
}

export default function usePost({ updateComments, setUpdateComments }: Params) {
  const postsOperations = usePostsOperations()

  const [ post, setPost ] = useState<PostInterface>()

  async function getPost() {
    const collectionReference = collection(firebaseOptions.database, 'posts')
    const snapshot = await getDocs(collectionReference)

    const post = snapshot.docs[0].data()
    const postID = snapshot.docs[0].id

    const authorDoc = await getDoc<DocumentData>(post.author)
    const authorData = authorDoc.data()

    const comments = await postsOperations.getComments(postID)
    const total_of_likes = await postsOperations.getTotalOfLikes(postID)
    const total_of_comments = await postsOperations.getTotalOfComments(postID)

    setPost({
      id: postID,
      content: post.content,
      image: post.image,
      author: {
        id: authorDoc.id,
        name: String(authorData?.name),
        description: String(authorData?.description),
        image: String(authorData?.image)
      },
      comments,
      total_of_likes,
      total_of_comments
    })
  }

  async function updateCommentsOfPost() {
    
    if (!!post) {
      const comments = await postsOperations.getComments(post.id)
      const total_of_likes = await postsOperations.getTotalOfLikes(post.id)
      const total_of_comments = await postsOperations.getTotalOfComments(post.id)

      setPost({
        ...post,
        comments,
        total_of_likes,
        total_of_comments
      })

      if (!!setUpdateComments) setUpdateComments(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  useEffect(() => {
    if (!!updateComments) {
      updateCommentsOfPost()
    }
  }, [ updateComments ])

  return post
}