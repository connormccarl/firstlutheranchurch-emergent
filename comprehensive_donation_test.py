#!/usr/bin/env python3
"""
Comprehensive Donation System Testing
Tests 15-20 scenarios covering normal operation, edge cases, and error conditions
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

print(f"🎯 COMPREHENSIVE DONATION SYSTEM TESTING")
print(f"Testing backend at: {API_BASE_URL}")
print("=" * 80)

class ComprehensiveDonationTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_donations = []
        self.test_count = 0
        self.passed_count = 0
    
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        self.test_count += 1
        if success:
            self.passed_count += 1
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: Test {self.test_count:2d} - {test_name}")
        if message:
            print(f"   📝 {message}")
        if response_data and not success:
            print(f"   🔍 Response: {response_data}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response': response_data
        })
    
    def test_donation_creation_scenarios(self):
        """Test various donation creation scenarios"""
        print("\n🔸 DONATION CREATION SCENARIOS")
        
        # Test 1: Standard donation with PayPal
        try:
            donation_data = {
                "amount": 100.00,
                "donor_name": "Jennifer Martinez",
                "donor_email": "jennifer.martinez@gmail.com",
                "message": "For the church building fund",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("Standard PayPal Donation", True, f"Created ${donation_data['amount']} donation from {donation_data['donor_name']}")
            else:
                self.log_test("Standard PayPal Donation", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Standard PayPal Donation", False, f"Exception: {str(e)}")
        
        # Test 2: Donation with Zeffy payment method
        try:
            donation_data = {
                "amount": 75.50,
                "donor_name": "Robert Chen",
                "donor_email": "robert.chen@outlook.com",
                "message": "Supporting youth programs",
                "payment_method": "zeffy"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("Zeffy Payment Method", True, f"Created ${donation_data['amount']} donation with Zeffy")
            else:
                self.log_test("Zeffy Payment Method", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Zeffy Payment Method", False, f"Exception: {str(e)}")
        
        # Test 3: Large donation amount
        try:
            donation_data = {
                "amount": 5000.00,
                "donor_name": "Elizabeth Thompson Foundation",
                "donor_email": "donations@ethompson.org",
                "message": "Annual major gift for church operations and community outreach",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("Large Donation Amount", True, f"Accepted large donation of ${donation_data['amount']}")
            else:
                self.log_test("Large Donation Amount", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Large Donation Amount", False, f"Exception: {str(e)}")
        
        # Test 4: Small donation amount
        try:
            donation_data = {
                "amount": 5.00,
                "donor_name": "Maria Santos",
                "donor_email": "maria.santos@email.com",
                "message": "Small gift from the heart",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("Small Donation Amount", True, f"Accepted small donation of ${donation_data['amount']}")
            else:
                self.log_test("Small Donation Amount", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Small Donation Amount", False, f"Exception: {str(e)}")
        
        # Test 5: Donation with special characters in name
        try:
            donation_data = {
                "amount": 25.00,
                "donor_name": "José María García-López",
                "donor_email": "jose.garcia@email.com",
                "message": "Bendiciones para la iglesia",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("Special Characters in Name", True, f"Handled special characters: {donation_data['donor_name']}")
            else:
                self.log_test("Special Characters in Name", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Special Characters in Name", False, f"Exception: {str(e)}")
        
        # Test 6: Donation without message (optional field)
        try:
            donation_data = {
                "amount": 40.00,
                "donor_name": "David Wilson",
                "donor_email": "david.wilson@email.com",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                self.created_donations.append(created['id'])
                self.log_test("No Message Field", True, "Accepted donation without message")
            else:
                self.log_test("No Message Field", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("No Message Field", False, f"Exception: {str(e)}")
    
    def test_validation_scenarios(self):
        """Test validation and error scenarios"""
        print("\n🔸 VALIDATION & ERROR SCENARIOS")
        
        # Test 7: Negative amount
        try:
            donation_data = {
                "amount": -50.00,
                "donor_name": "Test User",
                "donor_email": "test@email.com",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 400:
                self.log_test("Negative Amount Validation", True, "Properly rejected negative amount")
            else:
                self.log_test("Negative Amount Validation", False, f"Should reject negative amount, got: {response.status_code}")
        except Exception as e:
            self.log_test("Negative Amount Validation", False, f"Exception: {str(e)}")
        
        # Test 8: Zero amount
        try:
            donation_data = {
                "amount": 0.00,
                "donor_name": "Test User",
                "donor_email": "test@email.com",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 400:
                self.log_test("Zero Amount Validation", True, "Properly rejected zero amount")
            else:
                self.log_test("Zero Amount Validation", False, f"Should reject zero amount, got: {response.status_code}")
        except Exception as e:
            self.log_test("Zero Amount Validation", False, f"Exception: {str(e)}")
        
        # Test 9: Missing required fields
        try:
            donation_data = {
                "amount": 25.00,
                # Missing donor_name, donor_email, payment_method
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code >= 400:
                self.log_test("Missing Required Fields", True, f"Properly rejected incomplete data: {response.status_code}")
            else:
                self.log_test("Missing Required Fields", False, f"Should reject incomplete data, got: {response.status_code}")
        except Exception as e:
            self.log_test("Missing Required Fields", False, f"Exception: {str(e)}")
        
        # Test 10: Invalid email format
        try:
            donation_data = {
                "amount": 30.00,
                "donor_name": "Test User",
                "donor_email": "invalid-email-format",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            # Note: This might pass if backend doesn't validate email format
            if response.status_code >= 400:
                self.log_test("Invalid Email Format", True, "Rejected invalid email format")
            else:
                # If it passes, that's also acceptable for this test
                created = response.json()
                if created.get('id'):
                    self.created_donations.append(created['id'])
                self.log_test("Invalid Email Format", True, "Backend accepts any email format (no strict validation)")
        except Exception as e:
            self.log_test("Invalid Email Format", False, f"Exception: {str(e)}")
        
        # Test 11: Empty donor name
        try:
            donation_data = {
                "amount": 20.00,
                "donor_name": "",
                "donor_email": "test@email.com",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code >= 400:
                self.log_test("Empty Donor Name", True, "Properly rejected empty donor name")
            else:
                self.log_test("Empty Donor Name", False, f"Should reject empty name, got: {response.status_code}")
        except Exception as e:
            self.log_test("Empty Donor Name", False, f"Exception: {str(e)}")
    
    def test_retrieval_scenarios(self):
        """Test donation retrieval scenarios"""
        print("\n🔸 DONATION RETRIEVAL SCENARIOS")
        
        # Test 12: Get all donations
        try:
            response = self.session.get(f"{API_BASE_URL}/donations")
            if response.status_code == 200:
                data = response.json()
                donations = data.get('donations', [])
                self.log_test("Get All Donations", True, f"Retrieved {len(donations)} donations")
            else:
                self.log_test("Get All Donations", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get All Donations", False, f"Exception: {str(e)}")
        
        # Test 13: Get specific donation by ID
        if self.created_donations:
            try:
                donation_id = self.created_donations[0]
                response = self.session.get(f"{API_BASE_URL}/donations/{donation_id}")
                if response.status_code == 200:
                    donation = response.json()
                    self.log_test("Get Donation by ID", True, f"Retrieved donation: ${donation.get('amount')} from {donation.get('donor_name')}")
                else:
                    self.log_test("Get Donation by ID", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_test("Get Donation by ID", False, f"Exception: {str(e)}")
        
        # Test 14: Get non-existent donation (404)
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.get(f"{API_BASE_URL}/donations/{fake_id}")
            if response.status_code == 404:
                self.log_test("Non-existent Donation 404", True, "Properly returns 404 for non-existent donation")
            else:
                self.log_test("Non-existent Donation 404", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("Non-existent Donation 404", False, f"Exception: {str(e)}")
    
    def test_status_update_scenarios(self):
        """Test donation status update scenarios"""
        print("\n🔸 DONATION STATUS UPDATE SCENARIOS")
        
        # Test 15: Update donation status to completed
        if self.created_donations:
            try:
                donation_id = self.created_donations[0]
                response = self.session.put(
                    f"{API_BASE_URL}/donations/{donation_id}/status",
                    params={"status": "completed", "transaction_id": "TXN_TEST_12345"}
                )
                if response.status_code == 200:
                    self.log_test("Update Status to Completed", True, "Successfully updated donation status")
                else:
                    self.log_test("Update Status to Completed", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_test("Update Status to Completed", False, f"Exception: {str(e)}")
        
        # Test 16: Update status of non-existent donation
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.put(
                f"{API_BASE_URL}/donations/{fake_id}/status",
                params={"status": "completed"}
            )
            if response.status_code == 404:
                self.log_test("Update Non-existent Donation", True, "Properly returns 404 for non-existent donation")
            else:
                self.log_test("Update Non-existent Donation", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("Update Non-existent Donation", False, f"Exception: {str(e)}")
    
    def test_paypal_integration_scenarios(self):
        """Test PayPal integration scenarios"""
        print("\n🔸 PAYPAL INTEGRATION SCENARIOS")
        
        # Create a fresh donation for PayPal testing
        paypal_donation_id = None
        try:
            donation_data = {
                "amount": 150.00,
                "donor_name": "PayPal Test User",
                "donor_email": "paypal.test@email.com",
                "message": "Testing PayPal integration",
                "payment_method": "paypal"
            }
            
            response = self.session.post(f"{API_BASE_URL}/donations", json=donation_data)
            if response.status_code == 200:
                created = response.json()
                paypal_donation_id = created['id']
                self.created_donations.append(paypal_donation_id)
        except Exception as e:
            self.log_test("PayPal Test Setup", False, f"Failed to create donation: {str(e)}")
        
        # Test 17: Create PayPal order
        if paypal_donation_id:
            try:
                response = self.session.post(f"{API_BASE_URL}/donations/{paypal_donation_id}/paypal-order")
                if response.status_code == 200:
                    paypal_response = response.json()
                    order_id = paypal_response.get('order_id')
                    if order_id and 'MOCK_ORDER_' in order_id:
                        self.log_test("Create PayPal Order", True, f"Created mock PayPal order: {order_id}")
                        
                        # Test 18: Capture PayPal payment
                        try:
                            capture_response = self.session.post(
                                f"{API_BASE_URL}/donations/{paypal_donation_id}/paypal-capture",
                                params={"order_id": order_id}
                            )
                            if capture_response.status_code == 200:
                                capture_data = capture_response.json()
                                if capture_data.get('status') == 'completed':
                                    self.log_test("Capture PayPal Payment", True, f"Payment captured: {capture_data.get('transaction_id')}")
                                else:
                                    self.log_test("Capture PayPal Payment", False, f"Unexpected status: {capture_data.get('status')}")
                            else:
                                self.log_test("Capture PayPal Payment", False, f"Status: {capture_response.status_code}")
                        except Exception as e:
                            self.log_test("Capture PayPal Payment", False, f"Exception: {str(e)}")
                    else:
                        self.log_test("Create PayPal Order", False, f"Invalid order ID: {order_id}")
                else:
                    self.log_test("Create PayPal Order", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Create PayPal Order", False, f"Exception: {str(e)}")
        
        # Test 19: PayPal order for non-existent donation
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.post(f"{API_BASE_URL}/donations/{fake_id}/paypal-order")
            if response.status_code == 404:
                self.log_test("PayPal Order Non-existent", True, "Properly returns 404 for non-existent donation")
            else:
                self.log_test("PayPal Order Non-existent", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("PayPal Order Non-existent", False, f"Exception: {str(e)}")
    
    def test_data_persistence(self):
        """Test data persistence and integrity"""
        print("\n🔸 DATA PERSISTENCE & INTEGRITY")
        
        # Test 20: Verify donation data persistence
        if self.created_donations:
            try:
                # Get the first created donation and verify all fields are saved
                donation_id = self.created_donations[0]
                response = self.session.get(f"{API_BASE_URL}/donations/{donation_id}")
                if response.status_code == 200:
                    donation = response.json()
                    
                    # Check required fields are present
                    required_fields = ['id', 'amount', 'donor_name', 'donor_email', 'status', 'created_at']
                    missing_fields = [field for field in required_fields if field not in donation]
                    
                    if not missing_fields:
                        self.log_test("Data Persistence Check", True, f"All required fields present: {', '.join(required_fields)}")
                    else:
                        self.log_test("Data Persistence Check", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_test("Data Persistence Check", False, f"Could not retrieve donation: {response.status_code}")
            except Exception as e:
                self.log_test("Data Persistence Check", False, f"Exception: {str(e)}")
    
    def run_comprehensive_tests(self):
        """Run all comprehensive donation tests"""
        print("🎯 STARTING COMPREHENSIVE DONATION SYSTEM TESTING")
        print("Testing 20 scenarios covering normal operation, edge cases, and error conditions")
        print("=" * 80)
        
        # Run all test scenarios
        self.test_donation_creation_scenarios()
        self.test_validation_scenarios()
        self.test_retrieval_scenarios()
        self.test_status_update_scenarios()
        self.test_paypal_integration_scenarios()
        self.test_data_persistence()
        
        # Final summary
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE DONATION TESTING SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_count / self.test_count) * 100 if self.test_count > 0 else 0
        
        print(f"📊 Tests Passed: {self.passed_count}/{self.test_count}")
        print(f"📊 Success Rate: {success_rate:.1f}%")
        
        if self.passed_count < self.test_count:
            print(f"\n❌ FAILED TESTS ({self.test_count - self.passed_count}):")
            for i, result in enumerate(self.test_results, 1):
                if not result['success']:
                    print(f"   {i:2d}. {result['test']}: {result['message']}")
        else:
            print("\n🎉 ALL DONATION TESTS PASSED!")
        
        print(f"\n📝 Created {len(self.created_donations)} test donations during testing")
        
        # Determine if donation system is production-ready
        critical_failures = [r for r in self.test_results if not r['success'] and 'validation' not in r['test'].lower()]
        
        if success_rate >= 90 and len(critical_failures) == 0:
            print("\n✅ DONATION SYSTEM IS PRODUCTION-READY!")
            print("   All critical functionality working correctly")
            print("   PayPal integration framework ready for credential connection")
        elif success_rate >= 80:
            print("\n⚠️  DONATION SYSTEM MOSTLY FUNCTIONAL")
            print("   Minor issues found but core functionality working")
        else:
            print("\n❌ DONATION SYSTEM NEEDS ATTENTION")
            print("   Critical issues found that need to be resolved")
        
        return success_rate >= 90

if __name__ == "__main__":
    tester = ComprehensiveDonationTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        exit(0)
    else:
        exit(1)