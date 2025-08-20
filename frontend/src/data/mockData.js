// Mock data for First Lutheran Church of Miami

export const mockEvents = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    date: '2025-01-19',
    time: '1:00 PM',
    location: 'Main Sanctuary',
    description: 'Join us for traditional Lutheran worship with communion, hymns, and inspiring messages.',
    type: 'worship',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    pastor: 'Pastor James Dunham'
  },
  {
    id: 2,
    title: 'Bible Study & Language Classes',
    date: '2025-01-19',
    time: '2:00 PM',
    location: 'Fellowship Hall',
    description: 'Bible classes (1st Sunday) and language classes in 14 languages taught by Pastor James.',
    type: 'study',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'First Communion Classes',
    date: '2025-01-26',
    time: '2:00 PM',
    location: 'Sunday School Room',
    description: 'Special classes for children ages 7-11 preparing for First Communion.',
    type: 'study',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Catechism Classes',
    date: '2025-02-16',
    time: '2:00 PM',
    location: 'Sunday School Room',
    description: 'Faith instruction for children ages 8-11.',
    type: 'youth',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'World-Class Musical Event',
    date: '2025-01-28',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'Amazing musical performance featuring Dr. Tingting and special guests.',
    type: 'music',
    image: 'https://images.unsplash.com/photo-1516405885085-c997e5d89baa?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'Fellowship Meal',
    date: '2025-02-01',
    time: '6:00 PM',
    location: 'Local Restaurant',
    description: 'Monthly fellowship meal at a local restaurant - all are welcome!',
    type: 'fellowship',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop'
  }
];

export const mockMedia = [
  {
    id: 1,
    title: 'Sunday Sermon: Finding Hope in Dark Times',
    type: 'video',
    date: '2025-01-12',
    thumbnail: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=250&fit=crop',
    duration: '45:30',
    speaker: 'Pastor James Dunham',
    scripture: 'Psalm 23:4'
  },
  {
    id: 2,
    title: 'Dr. Tingting Piano Performance - Amazing Grace',
    type: 'video',
    date: '2025-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1482112252853-a77ee8d9a8cc?w=400&h=250&fit=crop',
    duration: '25:15',
    speaker: 'Dr. Tingting',
    scripture: 'Amazing Grace'
  },
  {
    id: 3,
    title: 'Baptism Service - New Life in Christ',
    type: 'video',
    date: '2025-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
    duration: '25:15',
    speaker: 'Pastor James Dunham'
  },
  {
    id: 4,
    title: 'Language Learning Success Stories',
    type: 'audio',
    date: '2025-01-07',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
    duration: '4:30'
  },
  {
    id: 5,
    title: 'Church Family Fellowship',
    type: 'photo',
    date: '2024-12-15',
    thumbnail: 'https://customer-assets.emergentagent.com/job_church-connect-16/artifacts/v75ihsk4_David%2C%20Pastor%20James%2C%20Tingting.jpg'
  },
  {
    id: 6,
    title: 'Community Outreach Event',
    type: 'photo',
    date: '2024-12-10',
    thumbnail: 'https://customer-assets.emergentagent.com/job_church-connect-16/artifacts/evoiorv3_Cristina%20and%20Pastor%20%28Santiago%29%20James.JPG'
  }
];

export const mockScheduleSlots = [
  { id: 1, date: '2025-01-20', time: '10:00 AM', available: true, type: 'counseling' },
  { id: 2, date: '2025-01-20', time: '2:00 PM', available: true, type: 'spiritual guidance' },
  { id: 3, date: '2025-01-21', time: '9:00 AM', available: false, type: 'counseling' },
  { id: 4, date: '2025-01-21', time: '11:00 AM', available: true, type: 'prayer session' },
  { id: 5, date: '2025-01-21', time: '3:00 PM', available: true, type: 'general meeting' },
  { id: 6, date: '2025-01-22', time: '10:00 AM', available: true, type: 'counseling' },
  { id: 7, date: '2025-01-22', time: '1:00 PM', available: true, type: 'spiritual guidance' },
  { id: 8, date: '2025-01-23', time: '9:30 AM', available: true, type: 'prayer session' },
  { id: 9, date: '2025-01-23', time: '2:30 PM', available: false, type: 'general meeting' },
  { id: 10, date: '2025-01-24', time: '11:00 AM', available: true, type: 'counseling' }
];

export const mockAIChatHistory = [
  {
    id: 1,
    message: "Hello! I'm your AI spiritual assistant from First Lutheran Church of Miami. How can I help you today?",
    sender: 'ai',
    timestamp: new Date().toISOString()
  }
];

// Mock functions for saving data to local storage
export const saveEvent = (event) => {
  const existingEvents = JSON.parse(localStorage.getItem('churchEvents') || '[]');
  const newEvent = {
    ...event,
    id: Date.now(),
    date: event.date,
    createdAt: new Date().toISOString()
  };
  const updatedEvents = [...existingEvents, newEvent];
  localStorage.setItem('churchEvents', JSON.stringify(updatedEvents));
  return newEvent;
};

export const getStoredEvents = () => {
  const stored = localStorage.getItem('churchEvents');
  return stored ? JSON.parse(stored) : [];
};

export const saveMediaItem = (media) => {
  const existingMedia = JSON.parse(localStorage.getItem('churchMedia') || '[]');
  const newMedia = {
    ...media,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  const updatedMedia = [...existingMedia, newMedia];
  localStorage.setItem('churchMedia', JSON.stringify(updatedMedia));
  return newMedia;
};

export const getStoredMedia = () => {
  const stored = localStorage.getItem('churchMedia');
  return stored ? JSON.parse(stored) : [];
};

export const saveScheduleBooking = (booking) => {
  const existingBookings = JSON.parse(localStorage.getItem('scheduleBookings') || '[]');
  const newBooking = {
    ...booking,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  const updatedBookings = [...existingBookings, newBooking];
  localStorage.setItem('scheduleBookings', JSON.stringify(updatedBookings));
  return newBooking;
};

export const getStoredBookings = () => {
  const stored = localStorage.getItem('scheduleBookings');
  return stored ? JSON.parse(stored) : [];
};

export const saveChatMessage = (message) => {
  const existingMessages = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
  const newMessage = {
    ...message,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  const updatedMessages = [...existingMessages, newMessage];
  localStorage.setItem('aiChatHistory', JSON.stringify(updatedMessages));
  return updatedMessages;
};