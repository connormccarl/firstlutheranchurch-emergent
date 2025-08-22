#!/usr/bin/env python3
"""
Backend API Test Suite for First Lutheran Church of Miami
Tests all API endpoints with realistic church data
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import os
import sys
from pathlib import Path

# Load environment variables
sys.path.append('/app/frontend')
from dotenv import load_dotenv

# Load frontend .env to get backend URL
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")

class ChurchAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_resources = {
            'events': [],
            'media': [],
            'slots': [],
            'bookings': []
        }
    
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response': response_data
        })
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{API_BASE_URL}/")
            
            if response.status_code == 200:
                data = response.json()
                if "First Lutheran Church of Miami API" in data.get('message', ''):
                    self.log_test("Health Check", True, f"Status: {response.status_code}, Message: {data['message']}")
                else:
                    self.log_test("Health Check", False, f"Unexpected message: {data}")
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
    
    def test_events_api(self):
        """Test Events API endpoints"""
        # Test GET /api/events (should work even if empty)
        try:
            response = self.session.get(f"{API_BASE_URL}/events")
            if response.status_code == 200:
                events = response.json()
                self.log_test("GET Events", True, f"Retrieved {len(events)} events")
            else:
                self.log_test("GET Events", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("GET Events", False, f"Exception: {str(e)}")
        
        # Test POST /api/events (create new event)
        try:
            event_data = {
                "title": "Sunday Worship Service",
                "description": "Traditional Lutheran worship with communion led by Pastor James Dunham",
                "date": "2025-01-26",
                "time": "13:00",
                "location": "1770 Brickell Avenue, Miami, FL 33129",
                "type": "worship",
                "pastor": "Pastor James Dunham",
                "image": ""
            }
            
            response = self.session.post(f"{API_BASE_URL}/events", json=event_data)
            if response.status_code == 200:
                created_event = response.json()
                self.created_resources['events'].append(created_event['id'])
                self.log_test("POST Events", True, f"Created event: {created_event['title']}")
            else:
                self.log_test("POST Events", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("POST Events", False, f"Exception: {str(e)}")
    
    def test_media_api(self):
        """Test Media API endpoints"""
        # Test GET /api/media
        try:
            response = self.session.get(f"{API_BASE_URL}/media")
            if response.status_code == 200:
                media = response.json()
                self.log_test("GET Media", True, f"Retrieved {len(media)} media items")
            else:
                self.log_test("GET Media", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("GET Media", False, f"Exception: {str(e)}")
        
        # Test POST /api/media
        try:
            media_data = {
                "title": "Sunday Sermon - Faith in Action",
                "type": "video",
                "speaker": "Pastor James Dunham",
                "scripture": "James 2:14-26",
                "description": "A powerful message about living out our faith through good works",
                "file_url": "https://example.com/sermons/faith-in-action.mp4",
                "thumbnail_url": "https://example.com/thumbnails/faith-in-action.jpg",
                "duration": "35:42"
            }
            
            response = self.session.post(f"{API_BASE_URL}/media", json=media_data)
            if response.status_code == 200:
                created_media = response.json()
                self.created_resources['media'].append(created_media['id'])
                self.log_test("POST Media", True, f"Created media: {created_media['title']}")
            else:
                self.log_test("POST Media", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("POST Media", False, f"Exception: {str(e)}")
    
    def test_schedule_api(self):
        """Test Schedule API endpoints"""
        # Test GET /api/schedule/slots
        try:
            response = self.session.get(f"{API_BASE_URL}/schedule/slots")
            if response.status_code == 200:
                slots = response.json()
                self.log_test("GET Schedule Slots", True, f"Retrieved {len(slots)} schedule slots")
            else:
                self.log_test("GET Schedule Slots", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("GET Schedule Slots", False, f"Exception: {str(e)}")
        
        # Test POST /api/schedule/slots
        try:
            slot_data = {
                "date": "2025-01-27",
                "time": "14:00",
                "type": "spiritual-guidance",
                "available": True
            }
            
            response = self.session.post(f"{API_BASE_URL}/schedule/slots", json=slot_data)
            if response.status_code == 200:
                created_slot = response.json()
                self.created_resources['slots'].append(created_slot['id'])
                self.log_test("POST Schedule Slots", True, f"Created slot for {created_slot['date']} at {created_slot['time']}")
                return created_slot['id']  # Return for booking test
            else:
                self.log_test("POST Schedule Slots", False, f"Status: {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("POST Schedule Slots", False, f"Exception: {str(e)}")
            return None
    
    def test_booking_api(self, slot_id=None):
        """Test Booking API endpoints"""
        # Test GET /api/schedule/bookings
        try:
            response = self.session.get(f"{API_BASE_URL}/schedule/bookings")
            if response.status_code == 200:
                bookings = response.json()
                self.log_test("GET Bookings", True, f"Retrieved {len(bookings)} bookings")
            else:
                self.log_test("GET Bookings", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("GET Bookings", False, f"Exception: {str(e)}")
        
        # Test POST /api/schedule/bookings (only if we have a slot)
        if slot_id:
            try:
                booking_data = {
                    "slot_id": slot_id,
                    "name": "Maria Rodriguez",
                    "email": "maria.rodriguez@email.com",
                    "phone": "(305) 555-0123",
                    "session_type": "spiritual-guidance",
                    "message": "I would like to discuss my spiritual journey and get guidance on prayer life."
                }
                
                response = self.session.post(f"{API_BASE_URL}/schedule/bookings", json=booking_data)
                if response.status_code == 200:
                    created_booking = response.json()
                    self.created_resources['bookings'].append(created_booking['id'])
                    self.log_test("POST Bookings", True, f"Created booking for {created_booking['name']}")
                else:
                    self.log_test("POST Bookings", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_test("POST Bookings", False, f"Exception: {str(e)}")
        else:
            self.log_test("POST Bookings", False, "No slot available for booking test")
    
    def test_ai_chat_api(self):
        """Test AI Chat API endpoint"""
        try:
            # Test with church-specific question
            chat_data = {
                "message": "What are your service times?",
                "session_id": str(uuid.uuid4())
            }
            
            response = self.session.post(f"{API_BASE_URL}/chat/message", json=chat_data)
            if response.status_code == 200:
                chat_response = response.json()
                ai_message = chat_response.get('message', '')
                
                # Check if response contains church-specific information
                church_keywords = ['1:00', '1 PM', 'Sunday', 'worship', 'Lutheran', 'Miami']
                contains_church_info = any(keyword.lower() in ai_message.lower() for keyword in church_keywords)
                
                if contains_church_info:
                    self.log_test("AI Chat Integration", True, f"AI responded with church-specific info: {ai_message[:100]}...")
                else:
                    self.log_test("AI Chat Integration", False, f"AI response lacks church-specific info: {ai_message[:100]}...")
            else:
                self.log_test("AI Chat Integration", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("AI Chat Integration", False, f"Exception: {str(e)}")
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://faith-connect-miami.preview.emergentagent.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = self.session.options(f"{API_BASE_URL}/events", headers=headers)
            
            # Check CORS headers
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin'] == '*' or 'church-connect' in str(cors_headers['Access-Control-Allow-Origin']):
                self.log_test("CORS Configuration", True, f"CORS properly configured: {cors_headers}")
            else:
                self.log_test("CORS Configuration", False, f"CORS headers: {cors_headers}")
                
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        # Test invalid event creation
        try:
            invalid_event = {"title": ""}  # Missing required fields
            response = self.session.post(f"{API_BASE_URL}/events", json=invalid_event)
            
            if response.status_code >= 400:
                self.log_test("Error Handling - Invalid Event", True, f"Properly rejected invalid event: {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid Event", False, f"Should have rejected invalid event: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Event", False, f"Exception: {str(e)}")
        
        # Test non-existent resource
        try:
            response = self.session.get(f"{API_BASE_URL}/events/non-existent-id")
            if response.status_code == 404:
                self.log_test("Error Handling - 404", True, "Properly returns 404 for non-existent resource")
            else:
                self.log_test("Error Handling - 404", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - 404", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("FIRST LUTHERAN CHURCH OF MIAMI - BACKEND API TESTS")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_health_check()
        self.test_cors_configuration()
        self.test_events_api()
        self.test_media_api()
        
        # Schedule tests (slot creation returns ID for booking test)
        slot_id = self.test_schedule_api()
        self.test_booking_api(slot_id)
        
        self.test_ai_chat_api()
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Tests Passed: {passed}/{total}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed < total:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"❌ {result['test']}: {result['message']}")
        
        print(f"\nCreated test resources:")
        for resource_type, ids in self.created_resources.items():
            if ids:
                print(f"  {resource_type}: {len(ids)} items")
        
        return passed == total

if __name__ == "__main__":
    tester = ChurchAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        exit(0)
    else:
        print("\n⚠️  SOME TESTS FAILED. Check the details above.")
        exit(1)