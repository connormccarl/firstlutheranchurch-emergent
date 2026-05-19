'use client';

/**
 * @module Events
 * Public `/events` page. Lists upcoming events from `/api/events`
 * (admin-managed) and lets visitors register via `/api/event-registrations`.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Upload, Filter, Search, UserPlus, Users, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import { mockEvents, saveEvent, getStoredEvents, calendarData } from '../data/mockData';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'worship',
    pastor: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Combine mock events with stored events
    const storedEvents = getStoredEvents();
    const allEvents = [...mockEvents, ...storedEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(allEvents);
    setFilteredEvents(allEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType]);

  // Handle edit event
  const handleEditClick = (event) => {
    setEventToEdit({...event});
    setShowEditDialog(true);
  };

  // Handle delete event
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  // Save edited event
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedEvents = events.map(event => 
        event.id === eventToEdit.id ? eventToEdit : event
      );
      setEvents(updatedEvents);
      
      // Save to localStorage
      const storedEvents = getStoredEvents();
      const updatedStoredEvents = storedEvents.map(event => 
        event.id === eventToEdit.id ? eventToEdit : event
      );
      localStorage.setItem('churchEvents', JSON.stringify(updatedStoredEvents));
      
      toast({
        title: "Event Updated!",
        description: `"${eventToEdit.title}" has been updated successfully.`,
      });
      
      setShowEditDialog(false);
      setEventToEdit(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete event
  const handleConfirmDelete = () => {
    try {
      const updatedEvents = events.filter(event => event.id !== eventToDelete.id);
      setEvents(updatedEvents);
      
      // Remove from localStorage
      const storedEvents = getStoredEvents();
      const updatedStoredEvents = storedEvents.filter(event => event.id !== eventToDelete.id);
      localStorage.setItem('churchEvents', JSON.stringify(updatedStoredEvents));
      
      toast({
        title: "Event Deleted!",
        description: `"${eventToDelete.title}" has been deleted successfully.`,
      });
      
      setShowDeleteDialog(false);
      setEventToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const savedEvent = saveEvent(newEvent);
    setEvents(prev => [...prev, savedEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    
    toast({
      title: "Event Added Successfully!",
      description: `${newEvent.title} has been added to the calendar.`,
    });

    // Reset form
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'worship',
      pastor: '',
      image: ''
    });
    setShowAddDialog(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock image upload - in real app would upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEvent({ ...newEvent, image: e.target.result });
        toast({
          title: "Image Uploaded",
          description: "Event image has been added successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      worship: 'bg-blue-100 text-blue-800',
      study: 'bg-green-100 text-green-800',
      outreach: 'bg-amber-100 text-amber-800',
      youth: 'bg-purple-100 text-purple-800',
      music: 'bg-pink-100 text-pink-800',
      fellowship: 'bg-orange-100 text-orange-800',
      meeting: 'bg-gray-100 text-gray-800',
      celebration: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Group events by month for better organization
  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => new Date(grouped[a][0].date) - new Date(grouped[b][0].date))
      .map(monthYear => ({
        monthYear,
        events: grouped[monthYear].sort((a, b) => new Date(a.date) - new Date(b.date))
      }));
  };

  // Handle event registration
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationDialog(true);
  };

  // Handle calendar event click - find the event and open registration
  const handleCalendarEventClick = (calendarEvent, month) => {
    // Find the matching event in the events array
    const matchingEvent = events.find(event => 
      event.title === calendarEvent.title && 
      (month === 'september' ? event.date.includes('2025-09') : event.date.includes('2025-10'))
    );
    
    if (matchingEvent) {
      handleEventClick(matchingEvent);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      
      // Send registration data to backend
      const response = await fetch(`${backendUrl}/api/event-registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_title: selectedEvent.title,
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone,
          notes: registrationData.notes
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Registration Successful!",
          description: `You've successfully registered for ${selectedEvent.title}. Pastor James will receive your registration and contact you directly.`,
        });

        console.log('Event registration successful:', result);
        
      } else {
        throw new Error('Registration failed');
      }

      // Clear form and close dialog
      setRegistrationData({ name: '', email: '', phone: '', notes: '' });
      setShowRegistrationDialog(false);
      setSelectedEvent(null);

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error with your registration. Please try contacting Pastor James directly at pastorjamesdunham@gmail.com or (313) 670-3830.",
        variant: "destructive"
      });
    }
  };

  const groupedEvents = groupEventsByMonth(filteredEvents);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Events & Calendar</h1>
            <p className="text-gray-600">Stay connected with all our church activities and special programs</p>
          </div>

        {/* Event Registration Dialog */}
        <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Register for Event
              </DialogTitle>
              <DialogDescription>
                {selectedEvent && (
                  <div className="space-y-2 mt-2">
                    <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {selectedEvent.date && (() => {
                          const [year, month, day] = selectedEvent.date.split('-');
                          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                          return date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                        })()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedEvent.time}
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedEvent.location}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  placeholder="Enter your full name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="reg-email">Email Address *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="reg-phone">Phone Number</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="reg-notes">Additional Notes</Label>
                <Textarea
                  id="reg-notes"
                  placeholder="Any special requests or questions?"
                  value={registrationData.notes}
                  onChange={(e) => setRegistrationData({...registrationData, notes: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRegistrationDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit Event
              </DialogTitle>
              <DialogDescription>
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            {eventToEdit && (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Event Title</Label>
                    <Input
                      id="edit-title"
                      value={eventToEdit.title}
                      onChange={(e) => setEventToEdit({...eventToEdit, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Event Type</Label>
                    <Select value={eventToEdit.type} onValueChange={(value) => setEventToEdit({...eventToEdit, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worship">Worship</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="fellowship">Fellowship</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={eventToEdit.date}
                      onChange={(e) => setEventToEdit({...eventToEdit, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Time</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={eventToEdit.time}
                      onChange={(e) => setEventToEdit({...eventToEdit, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={eventToEdit.location || ''}
                    onChange={(e) => setEventToEdit({...eventToEdit, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={eventToEdit.description || ''}
                    onChange={(e) => setEventToEdit({...eventToEdit, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image URL (optional)</Label>
                  <Input
                    id="edit-image"
                    value={eventToEdit.image || ''}
                    onChange={(e) => setEventToEdit({...eventToEdit, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pastor">Pastor/Leader (optional)</Label>
                  <Input
                    id="edit-pastor"
                    value={eventToEdit.pastor || ''}
                    onChange={(e) => setEventToEdit({...eventToEdit, pastor: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Event
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Event Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Event
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {eventToDelete && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{eventToDelete.title}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {eventToDelete.date}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {eventToDelete.time}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleConfirmDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new church event for the community.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worship">Worship</SelectItem>
                        <SelectItem value="study">Bible Study</SelectItem>
                        <SelectItem value="outreach">Community Outreach</SelectItem>
                        <SelectItem value="youth">Youth Ministry</SelectItem>
                        <SelectItem value="music">Musical Event</SelectItem>
                        <SelectItem value="fellowship">Fellowship</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Enter event location"
                  />
                </div>

                <div>
                  <Label htmlFor="pastor">Pastor/Leader</Label>
                  <Input
                    id="pastor"
                    value={newEvent.pastor}
                    onChange={(e) => setNewEvent({ ...newEvent, pastor: e.target.value })}
                    placeholder="Pastor James Dunham"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Describe the event..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Event Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                  {newEvent.image && (
                    <img src={newEvent.image} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded" />
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent} className="bg-blue-900 hover:bg-blue-800">
                    Add Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="worship">Worship</SelectItem>
                <SelectItem value="study">Bible Study</SelectItem>
                <SelectItem value="music">Musical Events</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
                <SelectItem value="celebration">Celebrations</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events by Month */}
        {groupedEvents.length > 0 ? (
          <div className="space-y-12">
            {groupedEvents.map(({ monthYear, events }) => (
              <div key={monthYear}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-amber-600" />
                  {monthYear}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card 
                      key={event.id} 
                      className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                    >
                      {event.image && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">{event.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getEventTypeColor(event.type)} variant="secondary">
                              {event.type}
                            </Badge>
                            {/* Show edit/delete buttons for user-added events (id > 1000) */}
                            {event.id > 1000 && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(event);
                                  }}
                                >
                                  <Edit className="h-3 w-3 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(event);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent onClick={() => handleEventClick(event)} className="cursor-pointer">
                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {(() => {
                              const [year, month, day] = event.date.split('-');
                              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                              return date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              });
                            })()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.time}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <CardDescription className="text-sm mb-3">
                            {event.description.substring(0, 100)}
                            {event.description.length > 100 && '...'}
                          </CardDescription>
                        )}
                        {event.pastor && (
                          <p className="text-sm text-amber-700 font-medium mb-3">
                            Led by {event.pastor}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Click to register
                          </span>
                          <UserPlus className="h-4 w-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No events are currently scheduled. Check back soon!'
              }
            </p>
          </div>
        )}

        {/* September 2025 Calendar */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-amber-600" />
            September 2025 Calendar
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* First 1 empty cell for September 2025 (starts on Monday - Sunday is position 0) */}
              <div className="h-24 border border-gray-100"></div>
              
              {/* September days */}
              {Array.from({ length: 30 }, (_, i) => {
                const date = i + 1;
                const dayEvents = calendarData.september2025.events.find(e => e.date === date);
                
                return (
                  <div 
                    key={date} 
                    className={`h-24 border border-gray-200 p-1 ${dayEvents ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="font-semibold text-sm text-gray-800 mb-1">{date}</div>
                    {dayEvents && (
                      <div className="space-y-1">
                        {dayEvents.events.slice(0, 2).map((event, idx) => (
                          <div 
                            key={idx}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer ${
                              event.type === 'worship' ? 'bg-blue-600' :
                              event.type === 'study' ? 'bg-green-600' :
                              event.type === 'meeting' ? 'bg-gray-600' :
                              event.type === 'celebration' ? 'bg-purple-600' :
                              'bg-amber-600'
                            }`}
                            title={`${event.time} - ${event.title}`}
                            onClick={() => handleCalendarEventClick(event, 'september')}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* October 2025 Calendar */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-amber-600" />
            October 2025 Calendar
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* First 3 empty cells for October 2025 (starts on Wednesday) */}
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`empty-oct-${i}`} className="h-24 border border-gray-100"></div>
              ))}
              
              {/* October days */}
              {Array.from({ length: 31 }, (_, i) => {
                const date = i + 1;
                const dayEvents = calendarData.october2025.events.find(e => e.date === date);
                
                return (
                  <div 
                    key={date} 
                    className={`h-24 border border-gray-200 p-1 ${dayEvents ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="font-semibold text-sm text-gray-800 mb-1">{date}</div>
                    {dayEvents && (
                      <div className="space-y-1">
                        {dayEvents.events.slice(0, 2).map((event, idx) => (
                          <div 
                            key={idx}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer ${
                              event.type === 'worship' ? 'bg-blue-600' :
                              event.type === 'study' ? 'bg-green-600' :
                              event.type === 'fellowship' ? 'bg-orange-600' :
                              'bg-amber-600'
                            }`}
                            title={`${event.time} - ${event.title}`}
                            onClick={() => handleCalendarEventClick(event, 'october')}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Special Notice */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-blue-50 p-6 rounded-lg border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-600" />
            Monthly Events Schedule
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Every Sunday:</h4>
              <ul className="space-y-1">
                <li>• 1:00-2:00 PM: Traditional Worship Service</li>
                <li>• 2:00-2:45 PM: Bible Classes & Language Learning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Special Programs:</h4>
              <ul className="space-y-1">
                <li>• 1st Sunday: Board of Directors & Family Bible Study</li>
                <li>• 2nd Sunday: First Communion Classes (ages 8-11)</li>
                <li>• 3rd Sunday: Catechism Classes (ages 11-13)</li>
                <li>• Monthly: Fellowship Meals & Community Events</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;