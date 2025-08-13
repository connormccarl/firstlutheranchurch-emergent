# First Lutheran Church of Miami - API Contracts & Integration Guide

## Overview
This document outlines the API contracts, data models, and integration plan for transitioning from mock data to a fully functional backend system.

## Current Mock Data to Replace

### 1. Events System
**Mock Data**: `mockEvents` in `/frontend/src/data/mockData.js`
**Frontend Storage**: `localStorage.churchEvents`
**Backend Requirements**: 
- Event creation, retrieval, editing, deletion
- Image upload and storage
- Event categorization and filtering
- Date-based queries

### 2. Media Library
**Mock Data**: `mockMedia` in `/frontend/src/data/mockData.js`
**Frontend Storage**: `localStorage.churchMedia`
**Backend Requirements**:
- Media file upload (video, audio, image)
- Thumbnail generation
- Metadata storage
- Search and filtering capabilities

### 3. Scheduling System
**Mock Data**: `mockScheduleSlots` in `/frontend/src/data/mockData.js`
**Frontend Storage**: `localStorage.scheduleBookings`
**Backend Requirements**:
- Available time slot management
- Booking creation and management
- Calendar integration
- Email notifications

### 4. AI Chat System
**Mock Data**: `mockAIChatHistory` in `/frontend/src/data/mockData.js`
**Frontend Storage**: `localStorage.aiChatHistory`
**Backend Requirements**:
- Chat session management
- Message persistence
- AI integration (Emergent LLM)
- Context-aware responses

## MongoDB Data Models

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  date: Date (required),
  time: String (required),
  location: String,
  type: String (enum: ['worship', 'study', 'outreach', 'youth', 'prayer']),
  pastor: String,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Media Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  type: String (enum: ['video', 'audio', 'photo']),
  speaker: String,
  scripture: String,
  description: String,
  fileUrl: String (required),
  thumbnailUrl: String,
  duration: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Schedule Collection
```javascript
{
  _id: ObjectId,
  date: Date (required),
  time: String (required),
  available: Boolean (default: true),
  type: String (enum: ['counseling', 'spiritual-guidance', 'prayer-session', 'general-meeting', 'crisis-support']),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  slotId: ObjectId (ref: Schedule),
  name: String (required),
  email: String (required),
  phone: String,
  sessionType: String,
  message: String,
  status: String (enum: ['pending', 'confirmed', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Sessions Collection
```javascript
{
  _id: ObjectId,
  sessionId: String (unique),
  messages: [{
    message: String,
    sender: String (enum: ['user', 'ai']),
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Events API
- `GET /api/events` - Retrieve all events (with filtering)
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/upload-image` - Upload event image

### Media API
- `GET /api/media` - Retrieve media (with filtering)
- `POST /api/media` - Upload new media
- `GET /api/media/:id` - Get specific media
- `PUT /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media
- `POST /api/media/upload` - Handle file uploads

### Schedule API
- `GET /api/schedule/slots` - Get available time slots
- `POST /api/schedule/slots` - Create time slot
- `GET /api/schedule/bookings` - Get all bookings
- `POST /api/schedule/bookings` - Create new booking
- `PUT /api/schedule/bookings/:id` - Update booking
- `DELETE /api/schedule/bookings/:id` - Cancel booking

### AI Chat API
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/session/:sessionId` - Get chat history
- `POST /api/chat/session` - Create new chat session

## Frontend Integration Plan

### Phase 1: Replace Mock Functions
1. Remove localStorage functions from `mockData.js`
2. Create API service layer (`/frontend/src/services/api.js`)
3. Implement Axios-based API calls
4. Add error handling and loading states

### Phase 2: Update Components
1. **Events.jsx**: Replace localStorage calls with API calls
2. **Media.jsx**: Integrate file upload with backend
3. **Schedule.jsx**: Connect to real scheduling system
4. **ChatWidget.jsx**: Integrate with Emergent LLM API

### Phase 3: File Upload Integration
1. Implement multipart form data for file uploads
2. Add progress indicators for large file uploads
3. Handle file validation and error states
4. Implement image optimization and thumbnail generation

## AI Integration Requirements

### Emergent LLM Integration
1. Install emergent integrations library
2. Configure EMERGENT_LLM_KEY environment variable
3. Implement context-aware chat responses
4. Add conversation history for better responses
5. Implement fallback responses for edge cases

### AI Response Categories
1. **Church Information**: Service times, events, contact info
2. **Biblical Guidance**: Scripture interpretation, spiritual questions
3. **Pastoral Care**: Scheduling meetings, prayer requests
4. **Community Engagement**: Volunteer opportunities, getting involved

## File Upload Strategy

### Events Images
- Storage: `/uploads/events/`
- Max size: 5MB
- Formats: JPG, PNG, WebP
- Auto-resize to optimize for web

### Media Files
- Videos: `/uploads/media/videos/` (Max: 100MB)
- Audio: `/uploads/media/audio/` (Max: 50MB)  
- Photos: `/uploads/media/photos/` (Max: 10MB)
- Generate thumbnails for videos
- Compress audio files for web delivery

## Error Handling Strategy

### Frontend
1. Display user-friendly error messages
2. Implement retry mechanisms for failed requests
3. Show loading states during API calls
4. Graceful fallbacks when backend is unavailable

### Backend
1. Comprehensive input validation
2. Structured error responses with appropriate HTTP codes
3. Logging for debugging and monitoring
4. Rate limiting for API protection

## Testing Strategy

### Backend Testing
1. Unit tests for all CRUD operations
2. Integration tests for AI chat functionality
3. File upload testing with various formats
4. Performance testing for media uploads

### Frontend Integration Testing
1. Test all CRUD operations through UI
2. File upload functionality testing
3. AI chat conversation testing
4. Mobile responsiveness verification

## Deployment Considerations

### Environment Variables
- `EMERGENT_LLM_KEY`: For AI integration
- `UPLOAD_PATH`: File storage location
- `MAX_FILE_SIZE`: Upload limits
- `ALLOWED_FILE_TYPES`: File type restrictions

### Performance Optimizations
1. Database indexing for frequently queried fields
2. File compression and optimization
3. API response caching where appropriate
4. Lazy loading for media content

This contract ensures seamless integration between frontend and backend while maintaining the excellent user experience already established.