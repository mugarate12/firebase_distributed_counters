import {
  useState,
  useEffect
} from 'react'

import { 
  addDoc,
  collection, 
  doc,
  getDoc,
  getDocs, 
  DocumentData,
  DocumentReference,
  updateDoc,
  increment,
  writeBatch,
  orderBy,
  query,
  where
} from 'firebase/firestore'

import { firebaseOptions } from './../config'

interface CommentInterface {
  id: string,
  content: string
  author: {
    id: string,
    name: string,
    description: string,
    image: string
  },
}

export default function usePostsOperations() {
  function createReference(postID: string, type: 'comments' | 'likes') {
    const countersCollection = collection(firebaseOptions.database, 'counters')
    const reference = doc(countersCollection, `post_${postID}_${type}`)

    return reference
  }

  async function createCounter(reference: DocumentReference<DocumentData>, totalOfShards: number) {
    const batch = writeBatch(firebaseOptions.database)
    
    batch.set(reference, { num_shards: totalOfShards })
  
    for (let i = 0; i < totalOfShards; i++) {
      const shardRef = doc(reference, 'shards', i.toString())
      batch.set(shardRef, { count: 0 })
    }
  
    return batch.commit()
  }
  
  async function incrementCounter(reference: DocumentReference<DocumentData>, totalOfShards: number) {
    const shardID = Math.floor(Math.random() * totalOfShards).toString()
    const shardRef = doc(reference, 'shards', shardID)
  
    return updateDoc(shardRef, 'count', increment(1))
  }
  
  async function decrementCounter(reference: DocumentReference<DocumentData>, totalOfShards: number) {
    const shardID = Math.floor(Math.random() * totalOfShards).toString()
    const shardRef = doc(reference, 'shards', shardID)
  
    return updateDoc(shardRef, 'count', increment(-1))
  }
  
  async function getCounter(reference: DocumentReference<DocumentData>) {
    const snapshot = await getDocs(collection(reference, 'shards'))
  
    let totalCount = 0
    snapshot.forEach(doc => {
      totalCount += Number(doc.data().count)
    })
  
    return totalCount
  }

  async function verifyDistributedCounter(reference: DocumentReference<DocumentData>) {
    const counterDocReference = await getDoc(reference)
    const isDistributedCounterExists = counterDocReference.exists()

    return isDistributedCounterExists
  }

  async function addLike(postID: string) {
    const reference = createReference(postID, 'likes')

    const isDistributedCounterExists = await verifyDistributedCounter(reference)

    if (isDistributedCounterExists) {
      await incrementCounter(reference, 10)
    } else {
      await createCounter(reference, 10)
      await incrementCounter(reference, 10)
    }
  }

  async function getTotalOfLikes(postID: string) {
    const reference = createReference(postID, 'likes')

    const isDistributedCounterExists = await verifyDistributedCounter(reference)

    if (isDistributedCounterExists) {
      const total = await getCounter(reference)
      return total
    } else {
      return 0
    }
  }

  async function addComment(postID: string, authorID: string, content: string) {
    // add comments to comments collection
    const commentsCollectionReference = collection(firebaseOptions.database, 'comments')
    await addDoc(commentsCollectionReference, {
      content,
      author: doc(firebaseOptions.database, `users/${authorID}`),
      post: doc(firebaseOptions.database, `posts/${postID}`),
      timestamp: Date.now()
    })

    // increment counter to number of likes
    const commentsCounterReference = createReference(postID, 'comments')
    const isDistributedCounterExists = await verifyDistributedCounter(commentsCounterReference)

    if (isDistributedCounterExists) {
      await incrementCounter(commentsCounterReference, 10)
    } else {
      await createCounter(commentsCounterReference, 10)
      await incrementCounter(commentsCounterReference, 10)
    }
  }

  async function getComments(postID: string) {
    const comments: Array<CommentInterface> = []

    const commentsCollectionReference = collection(firebaseOptions.database, 'comments')
    const q = query(
      commentsCollectionReference, 
      where('post', '==', doc(firebaseOptions.database, `posts/${postID}`)),
      orderBy('timestamp')
    )  

    const snapshot = await getDocs(q)
    const getCommentsWithAuthorInformation = snapshot.docs.map(async (doc) => {
      const data = doc.data()
      
      const content = data.content
      const authorDoc = await getDoc<DocumentData>(data.author)
      const authorData = authorDoc.data()

      comments.push({
        id: doc.id,
        content,
        author: {
          id: authorDoc.id,
          name: String(authorData?.name),
          description: String(authorData?.description),
          image: String(authorData?.image)
        }
      })
    })
    await Promise.all(getCommentsWithAuthorInformation)
  
    return comments
  }

  async function getTotalOfComments(postID: string) {
    const reference = createReference(postID, 'comments')

    const isDistributedCounterExists = await verifyDistributedCounter(reference)

    if (isDistributedCounterExists) {
      const total = await getCounter(reference)
      return total
    } else {
      return 0
    }
  }

  return {
    addLike,
    addComment,
    getComments,
    getTotalOfLikes,
    getTotalOfComments
  }
}