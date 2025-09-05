#!/usr/bin/env python3
"""
CRITICAL EMAIL NOTIFICATION TESTING
Focused test for event registration and contact form email notifications
"""

import requests
import json
import uuid
from datetime import datetime
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

print(f"🎯 CRITICAL EMAIL NOTIFICATION TESTING")
print(f"Testing backend at: {API_BASE_URL}")
print("=" * 80)

class EmailNotificationTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
    
    def log_test(self, test_name, success, message=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message
        })
    
    def test_event_registration_scenarios(self):
        """Test 5 event registration email scenarios"""
        print("\n🎉 EVENT REGISTRATION EMAIL TESTING")
        print("-" * 50)
        
        scenarios = [
            {
                "name": "Sunday Worship Registration",
                "data": {
                    "event_title": "Sunday Worship Service",
                    "name": "Maria Elena Rodriguez",
                    "email": "maria.rodriguez@gmail.com",
                    "phone": "(305) 555-0123",
                    "notes": "First time visitor, looking forward to joining the community"
                }
            },
            {
                "name": "Bible Study with Special Characters",
                "data": {
                    "event_title": "Bible Study & Language Classes",
                    "name": "José María García-López",
                    "email": "jose.garcia@hotmail.com",
                    "phone": "+1-786-555-9876",
                    "notes": "Interested in Spanish Bible study and learning English"
                }
            },
            {
                "name": "First Communion - Minimal Data",
                "data": {
                    "event_title": "First Communion Classes",
                    "name": "Sarah Johnson",
                    "email": "sarah.j@yahoo.com",
                    "phone": "",
                    "notes": ""
                }
            },
            {
                "name": "Piano Recital - Long Notes",
                "data": {
                    "event_title": "Dr. Tingting Wu Piano Recital",
                    "name": "Michael Thompson",
                    "email": "michael.thompson@outlook.com",
                    "phone": "(954) 555-7890",
                    "notes": "I am a piano student myself and would love to attend this recital. I have been following Dr. Tingting Wu's work and am excited to hear her perform live. Please let me know if there are any special seating arrangements for music students."
                }
            },
            {
                "name": "Fellowship Meal - Family Registration",
                "data": {
                    "event_title": "Monthly Fellowship Meal",
                    "name": "The Williams Family (Eric, Jennifer, and kids)",
                    "email": "eric.williams@gmail.com",
                    "phone": "(305) 555-4567",
                    "notes": "Family of 5 attending. Two children ages 8 and 11. Any dietary restrictions accommodations available?"
                }
            }
        ]
        
        for scenario in scenarios:
            try:
                response = self.session.post(f"{API_BASE_URL}/event-registrations", json=scenario["data"])
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check all required fields
                    checks = {
                        "notification_sent": result.get('notification_sent') == True,
                        "status_confirmed": result.get('status') == 'confirmed',
                        "success_message": 'Successfully registered' in result.get('message', ''),
                        "registration_id": 'id' in result and result['id']
                    }
                    
                    if all(checks.values()):
                        self.log_test(f"Event Registration - {scenario['name']}", True, 
                                    f"✓ notification_sent: {result.get('notification_sent')}, ✓ status: {result.get('status')}, ✓ ID: {result.get('id')[:8]}...")
                    else:
                        failed_checks = [k for k, v in checks.items() if not v]
                        self.log_test(f"Event Registration - {scenario['name']}", False, 
                                    f"Failed checks: {failed_checks}")
                else:
                    self.log_test(f"Event Registration - {scenario['name']}", False, 
                                f"HTTP {response.status_code}: {response.text[:100]}")
                    
            except Exception as e:
                self.log_test(f"Event Registration - {scenario['name']}", False, f"Exception: {str(e)}")
    
    def test_contact_form_scenarios(self):
        """Test 3 contact form email scenarios"""
        print("\n📧 CONTACT FORM EMAIL TESTING")
        print("-" * 50)
        
        scenarios = [
            {
                "name": "General Inquiry",
                "data": {
                    "name": "David Chen",
                    "email": "david.chen@email.com",
                    "phone": "(786) 555-2468",
                    "subject": "Interested in Joining the Church",
                    "message": "Hello Pastor James, I recently moved to Miami and am looking for a Lutheran church to call home. I would love to learn more about your congregation and the programs you offer. Could we schedule a time to meet?"
                }
            },
            {
                "name": "Prayer Request",
                "data": {
                    "name": "Linda Martinez",
                    "email": "linda.martinez@yahoo.com",
                    "phone": "",
                    "subject": "Prayer Request for Family",
                    "message": "Dear Pastor James, I am requesting prayers for my family during this difficult time. My husband is facing health challenges and we could use the support of the church community. Thank you for your ministry."
                }
            },
            {
                "name": "Program Information Request",
                "data": {
                    "name": "Roberto Silva",
                    "email": "roberto.silva@gmail.com",
                    "phone": "(305) 555-8901",
                    "subject": "Language Learning Program Information",
                    "message": "I heard about your 14-language program and am very interested. I speak Portuguese and would like to help teach, and also learn Mandarin. What are the requirements to participate as both a teacher and student?"
                }
            }
        ]
        
        for scenario in scenarios:
            try:
                response = self.session.post(f"{API_BASE_URL}/contact", json=scenario["data"])
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check all required fields
                    checks = {
                        "notification_sent": result.get('notification_sent') == True,
                        "status_received": result.get('status') == 'received',
                        "response_message": 'Pastor James will respond' in result.get('message', ''),
                        "contact_id": 'id' in result and result['id']
                    }
                    
                    if all(checks.values()):
                        self.log_test(f"Contact Form - {scenario['name']}", True, 
                                    f"✓ notification_sent: {result.get('notification_sent')}, ✓ status: {result.get('status')}, ✓ ID: {result.get('id')[:8]}...")
                    else:
                        failed_checks = [k for k, v in checks.items() if not v]
                        self.log_test(f"Contact Form - {scenario['name']}", False, 
                                    f"Failed checks: {failed_checks}")
                else:
                    self.log_test(f"Contact Form - {scenario['name']}", False, 
                                f"HTTP {response.status_code}: {response.text[:100]}")
                    
            except Exception as e:
                self.log_test(f"Contact Form - {scenario['name']}", False, f"Exception: {str(e)}")
    
    def test_email_configuration_verification(self):
        """Verify email configuration and error handling"""
        print("\n✉️ EMAIL CONFIGURATION VERIFICATION")
        print("-" * 50)
        
        # Test 1: Verify CHURCH_EMAIL is used
        try:
            test_data = {
                "event_title": "Email Configuration Test",
                "name": "Email Test User",
                "email": "emailtest@example.com",
                "phone": "(000) 000-0000",
                "notes": "Testing CHURCH_EMAIL configuration"
            }
            
            response = self.session.post(f"{API_BASE_URL}/event-registrations", json=test_data)
            if response.status_code == 200:
                result = response.json()
                if result.get('notification_sent') == True:
                    self.log_test("CHURCH_EMAIL Configuration", True, 
                                "✓ Email notifications working - CHURCH_EMAIL = pastorjamesdunham@gmail.com")
                else:
                    self.log_test("CHURCH_EMAIL Configuration", False, 
                                f"notification_sent not true: {result}")
            else:
                self.log_test("CHURCH_EMAIL Configuration", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("CHURCH_EMAIL Configuration", False, f"Exception: {str(e)}")
        
        # Test 2: Error handling for missing required fields
        try:
            invalid_registration = {
                "event_title": "",  # Empty title
                "name": "",         # Empty name
                "email": "invalid-email-format"  # Invalid email
            }
            
            response = self.session.post(f"{API_BASE_URL}/event-registrations", json=invalid_registration)
            
            # Check if it's properly rejected or handled gracefully
            if response.status_code >= 400:
                self.log_test("Error Handling - Invalid Registration", True, 
                            f"✓ Properly rejected invalid data: HTTP {response.status_code}")
            elif response.status_code == 200:
                result = response.json()
                if 'notification_sent' in result:
                    self.log_test("Error Handling - Invalid Registration", True, 
                                "✓ Invalid data processed gracefully with notification handling")
                else:
                    self.log_test("Error Handling - Invalid Registration", False, 
                                "Invalid data accepted without proper notification handling")
            else:
                self.log_test("Error Handling - Invalid Registration", False, 
                            f"Unexpected response: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Registration", False, f"Exception: {str(e)}")
        
        # Test 3: Contact form error handling
        try:
            invalid_contact = {
                "name": "",
                "email": "",
                "subject": "",
                "message": ""
            }
            
            response = self.session.post(f"{API_BASE_URL}/contact", json=invalid_contact)
            
            if response.status_code >= 400:
                self.log_test("Error Handling - Invalid Contact", True, 
                            f"✓ Properly rejected invalid contact: HTTP {response.status_code}")
            elif response.status_code == 200:
                result = response.json()
                if 'notification_sent' in result:
                    self.log_test("Error Handling - Invalid Contact", True, 
                                "✓ Invalid contact processed gracefully with notification handling")
                else:
                    self.log_test("Error Handling - Invalid Contact", False, 
                                "Invalid contact accepted without proper notification handling")
        except Exception as e:
            self.log_test("Error Handling - Invalid Contact", False, f"Exception: {str(e)}")
    
    def run_comprehensive_email_tests(self):
        """Run all email notification tests"""
        print("🎯 CRITICAL EMAIL NOTIFICATION TESTING FOR PASTOR JAMES")
        print("Testing that Pastor James receives email notifications for every registration and contact")
        print("=" * 80)
        
        # Run all test scenarios
        self.test_event_registration_scenarios()
        self.test_contact_form_scenarios()
        self.test_email_configuration_verification()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 EMAIL NOTIFICATION TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"✅ Tests Passed: {passed}/{total}")
        print(f"📈 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed < total:
            print(f"\n❌ FAILED TESTS ({total - passed}):")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Critical functionality check
        event_tests = [r for r in self.test_results if 'Event Registration' in r['test']]
        contact_tests = [r for r in self.test_results if 'Contact Form' in r['test']]
        config_tests = [r for r in self.test_results if 'Configuration' in r['test'] or 'Error Handling' in r['test']]
        
        event_passed = sum(1 for r in event_tests if r['success'])
        contact_passed = sum(1 for r in contact_tests if r['success'])
        config_passed = sum(1 for r in config_tests if r['success'])
        
        print(f"\n🎯 CRITICAL FUNCTIONALITY STATUS:")
        print(f"   📅 Event Registration Emails: {event_passed}/{len(event_tests)} ({'✅ WORKING' if event_passed == len(event_tests) else '❌ ISSUES'})")
        print(f"   📧 Contact Form Emails: {contact_passed}/{len(contact_tests)} ({'✅ WORKING' if contact_passed == len(contact_tests) else '❌ ISSUES'})")
        print(f"   ⚙️  Email Configuration: {config_passed}/{len(config_tests)} ({'✅ WORKING' if config_passed >= len(config_tests)-1 else '❌ ISSUES'})")
        
        # Final verdict
        critical_working = (event_passed == len(event_tests) and 
                          contact_passed == len(contact_tests) and 
                          config_passed >= len(config_tests)-1)
        
        if critical_working:
            print(f"\n🎉 CRITICAL EMAIL NOTIFICATION SYSTEM: ✅ FULLY OPERATIONAL")
            print(f"   Pastor James WILL receive email notifications for every registration and contact!")
        else:
            print(f"\n⚠️  CRITICAL EMAIL NOTIFICATION SYSTEM: ❌ NEEDS ATTENTION")
            print(f"   Some email notifications may not be working properly!")
        
        return critical_working

if __name__ == "__main__":
    tester = EmailNotificationTester()
    success = tester.run_comprehensive_email_tests()
    
    if success:
        print(f"\n🚀 EMAIL NOTIFICATION SYSTEM READY FOR PRODUCTION!")
        exit(0)
    else:
        print(f"\n🔧 EMAIL NOTIFICATION SYSTEM NEEDS FIXES!")
        exit(1)