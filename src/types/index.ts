export type ItemStatus = 'OWNED' | 'WANTED'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date
}

export interface Shelf {
  id: string
  name: string
  description: string | null
  color: string
  isPublic: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  user?: User
  items?: Item[]
  _count?: {
    items: number
  }
}

export interface Item {
  id: string
  url: string
  title: string
  imageUrl: string | null
  description: string | null
  status: ItemStatus
  shelfId: string
  createdAt: Date
  updatedAt: Date
  shelf?: Shelf
  _count?: {
    likes: number
    comments: number
  }
  isLiked?: boolean
}

export interface Comment {
  id: string
  content: string
  userId: string
  itemId: string
  createdAt: Date
  user?: User
}

export interface Like {
  id: string
  userId: string
  itemId: string
  createdAt: Date
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
}

export interface FeedItem {
  id: string
  type: 'item_added'
  item: Item & { shelf: Shelf & { user: User } }
  createdAt: Date
}



