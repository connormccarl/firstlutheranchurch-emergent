from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===============================
# PYDANTIC MODELS
# ===============================

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    date: str  # ISO date string
    time: str
    location: Optional[str] = ""
    type: str
    pastor: Optional[str] = ""
    image: Optional[str] = ""

class Event(EventCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MediaCreate(BaseModel):
    title: str
    type: str  # video, audio, photo
    speaker: Optional[str] = ""
    scripture: Optional[str] = ""
    description: Optional[str] = ""
    file_url: str
    thumbnail_url: Optional[str] = ""
    duration: Optional[str] = ""

class Media(MediaCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ScheduleSlotCreate(BaseModel):
    date: str  # ISO date string
    time: str
    type: str  # counseling, spiritual-guidance, prayer-session, etc.
    available: bool = True

class ScheduleSlot(ScheduleSlotCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    slot_id: str
    name: str
    email: str
    phone: Optional[str] = ""
    session_type: str
    message: Optional[str] = ""

class Booking(BookingCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    sender: str = "ai"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DonationCreate(BaseModel):
    amount: float
    donor_name: str
    donor_email: str
    message: Optional[str] = ""
    payment_method: str = "paypal"  # paypal, credit_card, etc.

class Donation(DonationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"  # pending, completed, failed
    paypal_order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

# ===============================
# AI CHAT INTEGRATION
# ===============================

# Initialize LLM Chat with Emergent key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

def get_church_system_message():
    return """You are an AI spiritual assistant for First Lutheran Church of Miami. You are knowledgeable, compassionate, and helpful. Here's important information about our church:

CHURCH INFORMATION:
- Location: 1770 Brickell Avenue, Miami, FL 33129
- Phone: (313) 670-3830
- Pastor: James Dunham (MDIV, 25+ years experience)
- Email: pastorjamesdunham@gmail.com
- Music Director: Dr. Tingting Wu (top 10 pianist worldwide)

WORSHIP SCHEDULE:
- Sunday Worship: 1:00-2:00 PM (Traditional Lutheran worship with communion)
- Bible Classes & Language Learning: 2:00-2:45 PM (Sundays)
- Board of Directors: 2:05 PM (1st Sunday of month)
- First Communion Classes: 2:00-2:30 PM (2nd Sunday, ages 8-11)
- Catechism Classes: 2:00-2:30 PM (3rd Sunday, ages 11-13)

SPECIAL PROGRAMS:
- Language Learning: 14 different languages taught by Pastor James
- Piano Lessons: Available with Dr. Tingting Wu
- Spanish and Evangelism Classes
- Monthly Fellowship Meals at local restaurants
- World-class musical events and recitals
- Preschool and elementary instruction

CHURCH BELIEFS:
- Lutheran Church holding strongly to Holy Scripture as "inerrant" (without errors)
- Believes in birth, substitutionary death and resurrection of Jesus Christ
- "No judgment zone" - welcoming to all people and ethnicities
- Celebrates 1¼ years of ministry in Miami (as of September 2025)

Your role is to:
1. Answer questions about church services, programs, and beliefs
2. Provide spiritual guidance and biblical perspectives
3. Help people connect with Pastor James for deeper counseling
4. Share information about getting involved in church activities
5. Be encouraging and supportive in difficult times

Always respond with warmth, wisdom, and biblical truth. If someone needs serious counseling or crisis support, gently suggest they schedule a meeting with Pastor James."""

async def get_ai_response(user_message: str, session_id: str = None) -> str:
    """Get AI response using Emergent LLM integration"""
    try:
        # Create session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Initialize chat with church-specific system message
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=get_church_system_message()
        ).with_model("openai", "gpt-4o-mini")
        
        # Create user message
        user_msg = UserMessage(text=user_message)
        
        # Get response
        response = await chat.send_message(user_msg)
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting AI response: {str(e)}")
        return "I apologize, but I'm having trouble responding right now. Please feel free to call our church at (313) 670-3830 or email Pastor James at pastorjamesdunham@gmail.com for assistance."

# ===============================
# API ENDPOINTS
# ===============================

@api_router.get("/")
async def root():
    return {"message": "First Lutheran Church of Miami API"}

# ===============================
# EVENTS ENDPOINTS
# ===============================

@api_router.get("/events", response_model=List[Event])
async def get_events():
    """Get all events"""
    try:
        events = await db.events.find().to_list(1000)
        return [Event(**event) for event in events]
    except Exception as e:
        logger.error(f"Error fetching events: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch events")

@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate):
    """Create new event"""
    try:
        event_obj = Event(**event.dict())
        await db.events.insert_one(event_obj.dict())
        return event_obj
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create event")

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    """Get specific event"""
    try:
        event = await db.events.find_one({"id": event_id})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return Event(**event)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch event")

@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event: EventCreate):
    """Update event"""
    try:
        event_data = event.dict()
        event_data["updated_at"] = datetime.utcnow()
        
        result = await db.events.update_one(
            {"id": event_id},
            {"$set": event_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        
        updated_event = await db.events.find_one({"id": event_id})
        return Event(**updated_event)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update event")

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """Delete event"""
    try:
        result = await db.events.delete_one({"id": event_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete event")

# ===============================
# MEDIA ENDPOINTS
# ===============================

@api_router.get("/media", response_model=List[Media])
async def get_media():
    """Get all media"""
    try:
        media = await db.media.find().to_list(1000)
        return [Media(**item) for item in media]
    except Exception as e:
        logger.error(f"Error fetching media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch media")

@api_router.post("/media", response_model=Media)
async def create_media(media: MediaCreate):
    """Create new media item"""
    try:
        media_obj = Media(**media.dict())
        await db.media.insert_one(media_obj.dict())
        return media_obj
    except Exception as e:
        logger.error(f"Error creating media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create media")

@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str):
    """Delete media item"""
    try:
        result = await db.media.delete_one({"id": media_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Media not found")
        return {"message": "Media deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting media: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete media")

# ===============================
# SCHEDULE ENDPOINTS
# ===============================

@api_router.get("/schedule/slots", response_model=List[ScheduleSlot])
async def get_schedule_slots():
    """Get all schedule slots"""
    try:
        slots = await db.schedule_slots.find().to_list(1000)
        return [ScheduleSlot(**slot) for slot in slots]
    except Exception as e:
        logger.error(f"Error fetching schedule slots: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch schedule slots")

@api_router.post("/schedule/slots", response_model=ScheduleSlot)
async def create_schedule_slot(slot: ScheduleSlotCreate):
    """Create new schedule slot"""
    try:
        slot_obj = ScheduleSlot(**slot.dict())
        await db.schedule_slots.insert_one(slot_obj.dict())
        return slot_obj
    except Exception as e:
        logger.error(f"Error creating schedule slot: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create schedule slot")

@api_router.get("/schedule/bookings", response_model=List[Booking])
async def get_bookings():
    """Get all bookings"""
    try:
        bookings = await db.bookings.find().to_list(1000)
        return [Booking(**booking) for booking in bookings]
    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch bookings")

@api_router.post("/schedule/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    """Create new booking"""
    try:
        # Check if slot is available
        slot = await db.schedule_slots.find_one({"id": booking.slot_id})
        if not slot:
            raise HTTPException(status_code=404, detail="Schedule slot not found")
        
        if not slot.get("available", False):
            raise HTTPException(status_code=400, detail="Schedule slot is not available")
        
        # Create booking
        booking_obj = Booking(**booking.dict())
        await db.bookings.insert_one(booking_obj.dict())
        
        # Mark slot as unavailable
        await db.schedule_slots.update_one(
            {"id": booking.slot_id},
            {"$set": {"available": False, "updated_at": datetime.utcnow()}}
        )
        
        return booking_obj
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create booking")

@api_router.delete("/schedule/bookings/{booking_id}")
async def cancel_booking(booking_id: str):
    """Cancel booking"""
    try:
        booking = await db.bookings.find_one({"id": booking_id})
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Mark booking as cancelled
        await db.bookings.update_one(
            {"id": booking_id},
            {"$set": {"status": "cancelled", "updated_at": datetime.utcnow()}}
        )
        
        # Mark slot as available again
        await db.schedule_slots.update_one(
            {"id": booking["slot_id"]},
            {"$set": {"available": True, "updated_at": datetime.utcnow()}}
        )
        
        return {"message": "Booking cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel booking")

# ===============================
# AI CHAT ENDPOINTS
# ===============================

@api_router.post("/chat/message", response_model=ChatResponse)
async def send_chat_message(message: ChatMessage):
    """Send message to AI assistant"""
    try:
        # Get AI response
        ai_response = await get_ai_response(message.message, message.session_id)
        
        # Store conversation in database
        conversation = {
            "id": str(uuid.uuid4()),
            "session_id": message.session_id or str(uuid.uuid4()),
            "messages": [
                {
                    "message": message.message,
                    "sender": "user",
                    "timestamp": datetime.utcnow()
                },
                {
                    "message": ai_response,
                    "sender": "ai", 
                    "timestamp": datetime.utcnow()
                }
            ],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.chat_sessions.insert_one(conversation)
        
        return ChatResponse(message=ai_response)
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@api_router.get("/chat/session/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for session"""
    try:
        session = await db.chat_sessions.find_one({"session_id": session_id})
        if not session:
            return {"messages": []}
        return {"messages": session.get("messages", [])}
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat history")

@api_router.post("/chat/session")
async def create_chat_session():
    """Create new chat session"""
    try:
        session_id = str(uuid.uuid4())
        session = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "messages": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.chat_sessions.insert_one(session)
        return {"session_id": session_id}
    except Exception as e:
        logger.error(f"Error creating chat session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create chat session")

# ===============================
# DONATION ENDPOINTS
# ===============================

@api_router.post("/donations", response_model=dict)
async def create_donation(donation: DonationCreate):
    """Create a new donation record"""
    try:
        # Validate donation amount
        if donation.amount <= 0:
            raise HTTPException(status_code=400, detail="Donation amount must be greater than 0")
        
        # Create donation record
        new_donation = Donation(**donation.dict())
        donation_dict = new_donation.dict()
        
        # Store in database
        result = await db.donations.insert_one(donation_dict)
        
        logger.info(f"Created donation record: {new_donation.id} for ${donation.amount}")
        
        return {
            "id": new_donation.id,
            "message": "Donation record created successfully",
            "amount": donation.amount,
            "status": "pending"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating donation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create donation")

@api_router.get("/donations")
async def get_donations(skip: int = 0, limit: int = 50):
    """Get all donations (for admin purposes)"""
    try:
        donations = await db.donations.find().sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
        return {"donations": donations}
    except Exception as e:
        logger.error(f"Error fetching donations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch donations")

@api_router.get("/donations/{donation_id}")
async def get_donation(donation_id: str):
    """Get a specific donation by ID"""
    try:
        donation = await db.donations.find_one({"id": donation_id})
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")
        return donation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching donation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch donation")

@api_router.put("/donations/{donation_id}/status")
async def update_donation_status(donation_id: str, status: str, transaction_id: Optional[str] = None):
    """Update donation status (for PayPal webhooks)"""
    try:
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        
        if transaction_id:
            update_data["transaction_id"] = transaction_id
            
        if status == "completed":
            update_data["completed_at"] = datetime.utcnow()
        
        result = await db.donations.update_one(
            {"id": donation_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Donation not found")
        
        logger.info(f"Updated donation {donation_id} status to {status}")
        return {"message": "Donation status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating donation status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update donation status")

# PayPal Integration Endpoints (Framework for future connection)
@api_router.post("/donations/{donation_id}/paypal-order")
async def create_paypal_order(donation_id: str):
    """Create PayPal order for donation (requires PayPal credentials)"""
    try:
        # Get donation record
        donation = await db.donations.find_one({"id": donation_id})
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")
            
        if donation["status"] != "pending":
            raise HTTPException(status_code=400, detail="Donation is not pending")
        
        # TODO: Integrate with PayPal SDK when credentials are available
        # For now, return a mock response
        mock_order_id = f"MOCK_ORDER_{uuid.uuid4().hex[:8].upper()}"
        
        # Update donation with PayPal order ID
        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {
                "paypal_order_id": mock_order_id,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {
            "order_id": mock_order_id,
            "status": "created",
            "links": [{
                "href": f"https://sandbox.paypal.com/checkoutnow?token={mock_order_id}",
                "rel": "approve",
                "method": "GET"
            }],
            "message": "PayPal integration ready - connect your PayPal account to enable live payments"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating PayPal order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create PayPal order")

@api_router.post("/donations/{donation_id}/paypal-capture")
async def capture_paypal_order(donation_id: str, order_id: str):
    """Capture PayPal payment (requires PayPal credentials)"""
    try:
        # Get donation record
        donation = await db.donations.find_one({"id": donation_id})
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")
            
        # TODO: Integrate with PayPal SDK when credentials are available
        # For now, simulate successful capture
        
        # Update donation status
        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {
                "status": "completed",
                "transaction_id": f"MOCK_TXN_{uuid.uuid4().hex[:8].upper()}",
                "completed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {
            "status": "completed",
            "transaction_id": f"MOCK_TXN_{uuid.uuid4().hex[:8].upper()}",
            "message": "Payment captured successfully (simulated - connect PayPal for live processing)"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error capturing PayPal payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to capture PayPal payment")

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)