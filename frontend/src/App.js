import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Events from "./components/Events";
import Media from "./components/Media";
import AIAssistant from "./components/AIAssistant";
import Schedule from "./components/Schedule";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import ChatWidget from "./components/ChatWidget";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/media" element={<Media />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        
        {/* Global Chat Widget */}
        <ChatWidget />
        
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;