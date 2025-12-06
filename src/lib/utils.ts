import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const PASTEL_COLORS = [
  { name: 'Blue', value: '#A8D5E2' },
  { name: 'Purple', value: '#D4C5E8' },
  { name: 'Pink', value: '#F4C2C2' },
  { name: 'Green', value: '#C8E6C9' },
  { name: 'Yellow', value: '#FFE5B4' },
  { name: 'Orange', value: '#FFD4B8' },
  { name: 'Coral', value: '#FFB5A7' },
] as const

export function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}



