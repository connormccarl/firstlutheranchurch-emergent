import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Check, AlertCircle, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import { mockScheduleSlots, saveScheduleBooking, getStoredBookings } from '../data/mockData';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    message: ''
  });
  const [myBookings, setMyBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMyBookings(getStoredBookings());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const slots = mockScheduleSlots.filter(slot => slot.date === dateString);
      setAvailableSlots(slots);
      setSelectedSlot(null);
      setShowBookingForm(false);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const sessionTypes = [
    { value: 'counseling', label: 'Pastoral Counseling', description: 'Personal guidance and spiritual counsel' },
    { value: 'spiritual-guidance', label: 'Spiritual Guidance', description: 'Discussion about faith and spiritual growth' },
    { value: 'prayer-session', label: 'Prayer Session', description: 'Dedicated time for prayer and spiritual support' },
    { value: 'general-meeting', label: 'General Meeting', description: 'Casual conversation and getting to know each other' },
    { value: 'crisis-support', label: 'Crisis Support', description: 'Immediate support during difficult times' }
  ];

  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    
    setSelectedSlot(slot);
    setBookingForm(prev => ({ ...prev, sessionType: slot.type }));
    setShowBookingForm(true);
  };

  const handleBooking = () => {
    if (!bookingForm.name || !bookingForm.email || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const booking = {
      ...bookingForm,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      type: selectedSlot.type
    };

    const savedBooking = saveScheduleBooking(booking);
    setMyBookings(prev => [...prev, savedBooking]);

    toast({
      title: "Meeting Scheduled Successfully!",
      description: `Your ${sessionTypes.find(t => t.value === selectedSlot.type)?.label} with Pastor James is confirmed for ${new Date(selectedSlot.date).toLocaleDateString()} at ${selectedSlot.time}.`,
    });

    // Reset form
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      sessionType: '',
      message: ''
    });
    setSelectedSlot(null);
    setSelectedDate(null);
    setShowBookingForm(false);
    
    // Update available slots to mark this one as unavailable
    setAvailableSlots(prev => 
      prev.map(slot => 
        slot.id === selectedSlot.id ? { ...slot, available: false } : slot
      )
    );
  };

  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const slotsForDate = mockScheduleSlots.filter(slot => slot.date === dateString);
    return slotsForDate.some(slot => slot.available);
  };

  const getSessionTypeInfo = (type) => {
    return sessionTypes.find(t => t.value === type) || sessionTypes[0];
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-900 p-3 rounded-full mr-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule with Pastor James</h1>
              <p className="text-gray-600 mt-1">Book a personal 1-on-1 session for guidance and support</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pastor Info & Calendar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pastor Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle>Pastor James Dunham</CardTitle>
                    <CardDescription>Senior Pastor</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  "I believe every person has immense value and God has an incredible plan for their life. 
                  I'm here to walk alongside you through any season - whether you're seeking answers, 
                  going through challenges, or wanting to grow deeper in your faith."
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>(305) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>pastor@firstlutheranmiami.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Select a Date
                </CardTitle>
                <CardDescription>
                  Choose a date to see available time slots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || !isDateAvailable(date)}
                  className="rounded-md border"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Only dates with available slots are selectable
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Types */}
            {!selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Session Types</CardTitle>
                  <CardDescription>Choose the type of meeting that best fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sessionTypes.map((type) => (
                      <div key={type.value} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium text-gray-900 mb-1">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Times - {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                  <CardDescription>Click on an available time slot to book</CardDescription>
                </CardHeader>
                <CardContent>
                  {availableSlots.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          className={`h-auto py-3 justify-start ${
                            !slot.available ? 'opacity-50 cursor-not-allowed' : 
                            selectedSlot?.id === slot.id ? 'bg-blue-900 hover:bg-blue-800' : ''
                          }`}
                          disabled={!slot.available}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <Clock className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">{slot.time}</div>
                                <div className="text-xs opacity-75">
                                  {getSessionTypeInfo(slot.type).label}
                                </div>
                              </div>
                            </div>
                            {!slot.available && (
                              <Badge variant="secondary" className="text-xs">
                                Booked
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No available slots for this date.</p>
                      <p className="text-sm text-gray-500">Please select a different date.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Booking Form */}
            {showBookingForm && selectedSlot && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    Complete Your Booking
                  </CardTitle>
                  <CardDescription>
                    {getSessionTypeInfo(selectedSlot.type).label} on {selectedDate.toLocaleDateString()} at {selectedSlot.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="(305) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">What would you like to discuss?</Label>
                    <Textarea
                      id="message"
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      placeholder="Share any specific topics you'd like to discuss or questions you have..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowBookingForm(false);
                        setSelectedSlot(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBooking}
                      className="bg-blue-900 hover:bg-blue-800"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Bookings */}
            {myBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled meetings with Pastor James</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {getSessionTypeInfo(booking.type).label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Schedule;