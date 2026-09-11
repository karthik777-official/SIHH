/**
 * Comprehensive Directory of Major Police Stations & Forensic Jurisdictions Across India
 * Organized by State / Union Territory for Easy Search & RBAC Assignment
 * SIH 2026 - AI-Powered Criminal Network Analysis System
 */

const INDIAN_POLICE_STATIONS = [
  // National & Central Intelligence Units
  { id: "NII-HQ", name: "NII Central Intelligence Directorate, New Delhi", state: "Central Jurisdiction", zone: "National" },
  { id: "NIA-DEL", name: "National Investigation Agency (NIA) HQ, CGO Complex, New Delhi", state: "Central Jurisdiction", zone: "National" },
  { id: "CBI-ACB", name: "CBI Anti-Corruption & Cyber Division, New Delhi", state: "Central Jurisdiction", zone: "National" },
  { id: "IB-CYBER", name: "Intelligence Bureau Special Cyber Cell, North Block, New Delhi", state: "Central Jurisdiction", zone: "National" },

  // Delhi NCT
  { id: "DL-01", name: "Parliament Street Police Station, New Delhi", state: "Delhi", zone: "New Delhi District" },
  { id: "DL-02", name: "Chanakyapuri Police Station, Diplomatic Enclave, New Delhi", state: "Delhi", zone: "New Delhi District" },
  { id: "DL-03", name: "Tughlak Road Police Station, New Delhi", state: "Delhi", zone: "New Delhi District" },
  { id: "DL-04", name: "Connaught Place Police Station, New Delhi", state: "Delhi", zone: "New Delhi District" },
  { id: "DL-05", name: "Tilak Marg Police Station, New Delhi", state: "Delhi", zone: "New Delhi District" },
  { id: "DL-06", name: "Special Cell Police Station, Lodhi Colony, New Delhi", state: "Delhi", zone: "Special Cell" },
  { id: "DL-07", name: "Cyber Crime Police Station, Rohini, Delhi", state: "Delhi", zone: "Cyber Cell" },
  { id: "DL-08", name: "Kotwali Police Station, Chandni Chowk, Old Delhi", state: "Delhi", zone: "North Delhi" },
  { id: "DL-09", name: "Hauz Khas Police Station, South Delhi", state: "Delhi", zone: "South District" },
  { id: "DL-10", name: "Vasant Kunj (North) Police Station, New Delhi", state: "Delhi", zone: "South West" },

  // Maharashtra
  { id: "MH-01", name: "Colaba Police Station, Mumbai", state: "Maharashtra", zone: "Mumbai South" },
  { id: "MH-02", name: "Marine Drive Police Station, Mumbai", state: "Maharashtra", zone: "Mumbai South" },
  { id: "MH-03", name: "Azad Maidan Police Station, Mumbai", state: "Maharashtra", zone: "Mumbai South" },
  { id: "MH-04", name: "Mumbai Crime Branch Unit 1 (CID), Crawford Market", state: "Maharashtra", zone: "Crime Branch" },
  { id: "MH-05", name: "Cyber Crime Police Station, BKC, Bandra East, Mumbai", state: "Maharashtra", zone: "Cyber Cell" },
  { id: "MH-06", name: "Shivaji Park Police Station, Dadar, Mumbai", state: "Maharashtra", zone: "Mumbai Central" },
  { id: "MH-07", name: "Andheri Police Station, Mumbai Suburban", state: "Maharashtra", zone: "Mumbai West" },
  { id: "MH-08", name: "Deccan Gymkhana Police Station, Pune City", state: "Maharashtra", zone: "Pune Commissionerate" },
  { id: "MH-09", name: "Lashkar Police Station, Camp, Pune", state: "Maharashtra", zone: "Pune Commissionerate" },
  { id: "MH-10", name: "Kolhapur City Police Station (Rajwada), Kolhapur", state: "Maharashtra", zone: "Kolhapur Range" },
  { id: "MH-11", name: "Juna Rajwada Police Station, Kolhapur", state: "Maharashtra", zone: "Kolhapur Range" },
  { id: "MH-12", name: "Naupada Police Station, Thane City", state: "Maharashtra", zone: "Thane Commissionerate" },
  { id: "MH-13", name: "Panchavati Police Station, Nashik City", state: "Maharashtra", zone: "Nashik Range" },
  { id: "MH-14", name: "Sitabuldi Police Station, Nagpur City", state: "Maharashtra", zone: "Nagpur Commissionerate" },

  // Tamil Nadu
  { id: "TN-01", name: "Madras High Court Police Station, Chennai", state: "Tamil Nadu", zone: "Chennai North" },
  { id: "TN-02", name: "Thousand Lights Police Station, Anna Salai, Chennai", state: "Tamil Nadu", zone: "Chennai East" },
  { id: "TN-03", name: "Ashok Nagar Police Station, Chennai", state: "Tamil Nadu", zone: "Chennai South" },
  { id: "TN-04", name: "Periamet Police Station (Madras Central), Chennai", state: "Tamil Nadu", zone: "Chennai North" },
  { id: "TN-05", name: "Thiruvanmiyur Police Station, ECR, Chennai", state: "Tamil Nadu", zone: "Chennai South" },
  { id: "TN-06", name: "Cyber Crime Wing, Greater Chennai Police Commissionerate, Vepery", state: "Tamil Nadu", zone: "Cyber Wing" },
  { id: "TN-07", name: "Sathyamangalam Police Station, Erode District", state: "Tamil Nadu", zone: "Western Range" },
  { id: "TN-08", name: "Bhavanisagar Police Station, Erode", state: "Tamil Nadu", zone: "Western Range" },
  { id: "TN-09", name: "Coimbatore Central (B-1 Bazaar) Police Station", state: "Tamil Nadu", zone: "Coimbatore City" },
  { id: "TN-10", name: "Madurai City Crime Record Bureau & Central PS", state: "Tamil Nadu", zone: "Madurai Range" },

  // Karnataka
  { id: "KA-01", name: "Vidhana Soudha Police Station, Bengaluru", state: "Karnataka", zone: "Bengaluru Central" },
  { id: "KA-02", name: "Cubbon Park Police Station, Bengaluru", state: "Karnataka", zone: "Bengaluru Central" },
  { id: "KA-03", name: "Cyber Crime Police Station (CID), Carlton House, Bengaluru", state: "Karnataka", zone: "CID Karnataka" },
  { id: "KA-04", name: "Ashok Nagar Police Station, Bengaluru", state: "Karnataka", zone: "Bengaluru East" },
  { id: "KA-05", name: "Koramangala Police Station, Bengaluru", state: "Karnataka", zone: "Bengaluru South" },
  { id: "KA-06", name: "Mangalore North (Bunder) Police Station, Mangaluru", state: "Karnataka", zone: "Western Range" },
  { id: "KA-07", name: "Urwa Police Station, Mangaluru", state: "Karnataka", zone: "Mangaluru City" },
  { id: "KA-08", name: "Madikeri Town Police Station, Kodagu District", state: "Karnataka", zone: "Southern Range" },
  { id: "KA-09", name: "Kollegal Rural Police Station, Chamarajanagar (MM Hills)", state: "Karnataka", zone: "Southern Range" },
  { id: "KA-10", name: "Mysuru Devaraja Police Station, Mysuru City", state: "Karnataka", zone: "Mysuru Commissionerate" },

  // Uttar Pradesh
  { id: "UP-01", name: "Hazratganj Police Station, Lucknow", state: "Uttar Pradesh", zone: "Lucknow Commissionerate" },
  { id: "UP-02", name: "Cyber Crime Police Station, Sector 36, Noida", state: "Uttar Pradesh", zone: "Gautam Buddha Nagar" },
  { id: "UP-03", name: "Gomti Nagar Police Station, Lucknow", state: "Uttar Pradesh", zone: "Lucknow East" },
  { id: "UP-04", name: "Sigra Police Station, Varanasi", state: "Uttar Pradesh", zone: "Varanasi Commissionerate" },
  { id: "UP-05", name: "Kotwali Police Station, Ayodhya", state: "Uttar Pradesh", zone: "Ayodhya Range" },
  { id: "UP-06", name: "Tajganj Police Station, Agra", state: "Uttar Pradesh", zone: "Agra Commissionerate" },
  { id: "UP-07", name: "Civil Lines Police Station, Prayagraj", state: "Uttar Pradesh", zone: "Prayagraj Commissionerate" },
  { id: "UP-08", name: "Gorakhpur Cantt Police Station, Gorakhpur", state: "Uttar Pradesh", zone: "Gorakhpur Range" },

  // West Bengal
  { id: "WB-01", name: "Lalbazar Central Police Station (HQ), Kolkata", state: "West Bengal", zone: "Kolkata Police HQ" },
  { id: "WB-02", name: "Bowbazar Police Station, Kolkata", state: "West Bengal", zone: "Kolkata Central" },
  { id: "WB-03", name: "Park Street Police Station, Kolkata", state: "West Bengal", zone: "Kolkata South" },
  { id: "WB-04", name: "Cyber Crime Police Station, Lalbazar, Kolkata", state: "West Bengal", zone: "Cyber Division" },
  { id: "WB-05", name: "Salt Lake Sector V Cyber Police Station, Bidhannagar", state: "West Bengal", zone: "Bidhannagar" },
  { id: "WB-06", name: "Siliguri Town Police Station, Darjeeling", state: "West Bengal", zone: "North Bengal" },

  // Punjab & Chandigarh
  { id: "PB-01", name: "Sector 17 Central Police Station, Chandigarh UT", state: "Chandigarh", zone: "UT Police HQ" },
  { id: "PB-02", name: "Kotwali Police Station, Patiala City", state: "Punjab", zone: "Patiala Range" },
  { id: "PB-03", name: "Civil Lines Police Station, Amritsar", state: "Punjab", zone: "Amritsar Commissionerate" },
  { id: "PB-04", name: "State Cyber Crime Bureau, Phase-4, SAS Nagar (Mohali)", state: "Punjab", zone: "State Crime Branch" },
  { id: "PB-05", name: "Division No. 1 (Kotwali) Police Station, Ludhiana", state: "Punjab", zone: "Ludhiana Commissionerate" },

  // Assam & North East
  { id: "AS-01", name: "Dispur Police Station, Capital Complex, Guwahati", state: "Assam", zone: "Guwahati Commissionerate" },
  { id: "AS-02", name: "Paltan Bazar Police Station, Guwahati", state: "Assam", zone: "Guwahati Central" },
  { id: "AS-03", name: "CID Headquarters & Cyber Dome, Ulubari, Guwahati", state: "Assam", zone: "CID Assam" },
  { id: "AS-04", name: "Diphu Police Station, Karbi Anglong", state: "Assam", zone: "Eastern Range" },

  // Gujarat
  { id: "GJ-01", name: "Crime Branch Police Station, Gaekwad Haveli, Ahmedabad", state: "Gujarat", zone: "Crime Branch" },
  { id: "GJ-02", name: "Navrangpura Police Station, Ahmedabad", state: "Gujarat", zone: "Sector 1" },
  { id: "GJ-03", name: "Cyber Crime Police Station, Surat City", state: "Gujarat", zone: "Surat Commissionerate" },
  { id: "GJ-04", name: "Sayajiganj Police Station, Vadodara", state: "Gujarat", zone: "Vadodara City" },

  // Kerala
  { id: "KL-01", name: "Museum Police Station, Thiruvananthapuram", state: "Kerala", zone: "Thiruvananthapuram City" },
  { id: "KL-02", name: "Cyber Police Station, Police HQ, Thiruvananthapuram", state: "Kerala", zone: "Cyber Crime Wing" },
  { id: "KL-03", name: "Ernakulam Central Police Station, Kochi", state: "Kerala", zone: "Kochi City" },
  { id: "KL-04", name: "Fort Kochi Police Station, Kochi", state: "Kerala", zone: "Coastal Police" },

  // Telangana & Andhra Pradesh
  { id: "TS-01", name: "Panjagutta Police Station, Hyderabad", state: "Telangana", zone: "Hyderabad West Zone" },
  { id: "TS-02", name: "Banjara Hills Police Station, Hyderabad", state: "Telangana", zone: "Hyderabad West Zone" },
  { id: "TS-03", name: "Cyberabad Cyber Crime Police Station, Gachibowli", state: "Telangana", zone: "Cyberabad" },
  { id: "TS-04", name: "Charminar Police Station, Old City, Hyderabad", state: "Telangana", zone: "South Zone" },
  { id: "AP-01", name: "Governorpet Police Station, Vijayawada City", state: "Andhra Pradesh", zone: "Vijayawada" },
  { id: "AP-02", name: "Visakhapatnam Cyber Crime PS, Beach Road", state: "Andhra Pradesh", zone: "Visakhapatnam" },

  // Jammu & Kashmir
  { id: "JK-01", name: "Kothi Bagh Police Station, Srinagar", state: "Jammu & Kashmir", zone: "East Srinagar" },
  { id: "JK-02", name: "Shaheed Gunj Police Station, Srinagar", state: "Jammu & Kashmir", zone: "South Srinagar" },
  { id: "JK-03", name: "Gandhi Nagar Police Station, Jammu City", state: "Jammu & Kashmir", zone: "Jammu South" },
  { id: "JK-04", name: "Special Operations Group (SOG) Camp, Cargo, Srinagar", state: "Jammu & Kashmir", zone: "Counter Insurgency" }
];
