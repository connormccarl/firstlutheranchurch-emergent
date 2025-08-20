import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Upload, Filter, Search } from 'lucide-react';
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
import { mockEvents, saveEvent, getStoredEvents } from '../data/mockData';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
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
      fellowship: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Events</h1>
            <p className="text-gray-600">Stay connected with all our church activities and programs</p>
          </div>
          
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
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
                <SelectItem value="music">Musical Events</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {event.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                  <Badge className={getEventTypeColor(event.type)} variant="secondary">
                    {event.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                  <p className="text-sm text-amber-700 font-medium">
                    Led by {event.pastor}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
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
      </div>

      <Footer />
    </div>
  );
};

export default Events;