// Mock data for First Lutheran Church of Miami

export const mockEvents = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    date: '2025-01-19',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for traditional Lutheran worship with communion, hymns, and inspiring messages.',
    type: 'worship',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    pastor: 'Pastor James Dunham'
  },
  {
    id: 2,
    title: 'Bible Study: Book of Romans',
    date: '2025-01-22',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'Deep dive into Paul\'s letter to the Romans. All are welcome to join this enriching study.',
    type: 'study',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Community Outreach - Food Drive',
    date: '2025-01-25',
    time: '9:00 AM',
    location: 'Downtown Miami',
    description: 'Help us serve our community by distributing food to those in need.',
    type: 'outreach',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Youth Group Game Night',
    date: '2025-01-26',
    time: '6:00 PM',
    location: 'Youth Center',
    description: 'Fun evening of games, fellowship, and pizza for teens and young adults.',
    type: 'youth',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'Women\'s Prayer Circle',
    date: '2025-01-28',
    time: '10:00 AM',
    location: 'Prayer Room',
    description: 'Monthly gathering for prayer, encouragement, and fellowship among women.',
    type: 'prayer',
    image: 'https://images.unsplash.com/photo-1516405885085-c997e5d89baa?w=400&h=250&fit=crop'
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
    title: 'Christmas Eve Service 2024',
    type: 'video',
    date: '2024-12-24',
    thumbnail: 'https://images.unsplash.com/photo-1482112252853-a77ee8d9a8cc?w=400&h=250&fit=crop',
    duration: '1:15:20',
    speaker: 'Pastor James Dunham',
    scripture: 'Luke 2:8-20'
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
    title: 'Church Choir - Amazing Grace',
    type: 'audio',
    date: '2025-01-07',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
    duration: '4:30'
  },
  {
    id: 5,
    title: 'Youth Ministry Mission Trip',
    type: 'photo',
    date: '2024-12-15',
    thumbnail: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'Community Easter Celebration',
    type: 'photo',
    date: '2024-03-31',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=250&fit=crop'
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
    message: "Hello! I'm your AI spiritual assistant. How can I help you today?",
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