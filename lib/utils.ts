import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeIndicator(timestamp: string | Date) {
  const date = (timestamp instanceof Date ? timestamp : new Date(timestamp));
  let secondsPast = ((new Date()).getTime() - (new Date(date.getTime() - ((new Date()).getTimezoneOffset() * 60000))).getTime()) / 1000;
  if(isNaN(secondsPast)) {
    return 'Invalid date';
  }
  if(process.env.NODE_ENV === "production") {
    secondsPast += 25200; // Add 7 hours to match UTC+7
  }
  if(secondsPast < 60) {
    return 'Just now';
  }
  if(secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if(secondsPast <= 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if(secondsPast <= 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if(secondsPast <= 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(secondsPast / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function isMobile() {
  return (window.innerWidth <= 640);
}