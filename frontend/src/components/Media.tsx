'use client';

/**
 * @module Media
 * Public `/media` page. Curated YouTube video grid; thumbnails route
 * to in-app `/video/[videoId]` rather than redirecting to youtube.com.
 */

import React, { useState, useEffect } from 'react';
import { Play, Upload, Filter, Search, Video, Music, Image as ImageIcon, Calendar, User } from 'lucide-react';
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
import { mockMedia, saveMediaItem, getStoredMedia } from '../data/mockData';

const Media = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMedia, setNewMedia] = useState({
    title: '',
    type: 'video',
    speaker: '',
    scripture: '',
    description: '',
    file: null,
    thumbnail: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Combine mock media with stored media
    const storedMedia = getStoredMedia();
    const allMedia = [...mockMedia, ...storedMedia].sort((a, b) => new Date(b.date) - new Date(a.date));
    setMedia(allMedia);
    setFilteredMedia(allMedia);
  }, []);

  useEffect(() => {
    let filtered = media;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.scripture && item.scripture.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    setFilteredMedia(filtered);
  }, [media, searchTerm, filterType]);

  const handleAddMedia = () => {
    if (!newMedia.title || !newMedia.file) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and upload a file.",
        variant: "destructive",
      });
      return;
    }

    const savedMedia = saveMediaItem({
      ...newMedia,
      duration: newMedia.type === 'photo' ? null : '0:00',
      thumbnail: newMedia.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    });
    
    setMedia(prev => [savedMedia, ...prev]);
    
    toast({
      title: "Media Added Successfully!",
      description: `${newMedia.title} has been uploaded to the media library.`,
    });

    // Reset form
    setNewMedia({
      title: '',
      type: 'video',
      speaker: '',
      scripture: '',
      description: '',
      file: null,
      thumbnail: ''
    });
    setShowAddDialog(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock file upload - in real app would upload to server
      setNewMedia({ ...newMedia, file: file.name });
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be uploaded.`,
      });
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewMedia({ ...newMedia, thumbnail: e.target.result });
        toast({
          title: "Thumbnail Uploaded",
          description: "Media thumbnail has been added successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      case 'photo':
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
    }
  };

  const getMediaTypeColor = (type) => {
    const colors = {
      video: 'bg-red-100 text-red-800',
      audio: 'bg-green-100 text-green-800',
      photo: 'bg-blue-100 text-blue-800'
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
            <p className="text-gray-600">Sermons, worship music, and church memories</p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 mt-4 md:mt-0">
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Media</DialogTitle>
                <DialogDescription>
                  Add new sermons, music, or photos to the church media library.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Media Title *</Label>
                    <Input
                      id="title"
                      value={newMedia.title}
                      onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                      placeholder="Enter media title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Media Type</Label>
                    <Select value={newMedia.type} onValueChange={(value) => setNewMedia({ ...newMedia, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speaker">Speaker/Pastor</Label>
                    <Input
                      id="speaker"
                      value={newMedia.speaker}
                      onChange={(e) => setNewMedia({ ...newMedia, speaker: e.target.value })}
                      placeholder="Pastor James Dunham"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scripture">Scripture Reference</Label>
                    <Input
                      id="scripture"
                      value={newMedia.scripture}
                      onChange={(e) => setNewMedia({ ...newMedia, scripture: e.target.value })}
                      placeholder="e.g., John 3:16"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMedia.description}
                    onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    placeholder="Describe the media content..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Media File *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="file"
                      type="file"
                      accept={newMedia.type === 'video' ? 'video/*' : newMedia.type === 'audio' ? 'audio/*' : 'image/*'}
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                  {newMedia.file && (
                    <p className="text-sm text-green-600 mt-1">File selected: {newMedia.file}</p>
                  )}
                </div>

                {newMedia.type !== 'photo' && (
                  <div>
                    <Label htmlFor="thumbnail">Thumbnail Image</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="flex-1"
                      />
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    {newMedia.thumbnail && (
                      <img src={newMedia.thumbnail} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded" />
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMedia} className="bg-blue-900 hover:bg-blue-800">
                    Upload Media
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
              placeholder="Search media..."
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
                <SelectItem value="all">All Media</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="bg-white bg-opacity-90 hover:bg-white text-black">
                    {getMediaIcon(item.type)}
                    <span className="ml-2">
                      {item.type === 'photo' ? 'View' : 'Play'}
                    </span>
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getMediaTypeColor(item.type)} variant="secondary">
                    {item.type}
                  </Badge>
                </div>
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {item.duration}
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  {item.speaker && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {item.speaker}
                    </div>
                  )}
                  
                  {item.scripture && (
                    <p className="text-amber-700 font-medium">
                      {item.scripture}
                    </p>
                  )}
                </div>
                
                {item.description && (
                  <CardDescription className="text-sm">
                    {item.description.substring(0, 100)}
                    {item.description.length > 100 && '...'}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No media items are currently available. Upload some content to get started!'
              }
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Media;