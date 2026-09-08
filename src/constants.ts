
import { Complaint, Category } from './types';

export const DEPARTMENT_MAPPING: Record<Category, { name: string; email: string; resolution: string; recommendation: string }> = {
  Road: {
    name: 'Public Works Department (PWD)',
    email: 'pwd@civicpulse.gov',
    resolution: '3 days',
    recommendation: 'Road inspection and repair team dispatch.'
  },
  Garbage: {
    name: 'Sanitation Department',
    email: 'sanitation@civicpulse.gov',
    resolution: '24 hours',
    recommendation: 'Garbage collection team deployment.'
  },
  Water: {
    name: 'Water Supply Department',
    email: 'water@civicpulse.gov',
    resolution: '48 hours',
    recommendation: 'Water board technical team inspection.'
  },
  Streetlight: {
    name: 'Electricity Department',
    email: 'electricity@civicpulse.gov',
    resolution: '24 hours',
    recommendation: 'Electrical maintenance crew dispatch.'
  },
  Flood: {
    name: 'Disaster Management Department',
    email: 'disaster@civicpulse.gov',
    resolution: '12 hours',
    recommendation: 'Emergency response and drainage clearance.'
  },
  Other: {
    name: 'General Administration',
    email: 'admin@civicpulse.gov',
    resolution: '5 days',
    recommendation: 'General assessment and routing.'
  }
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP1001',
    title: 'Main Road Pothole',
    description: 'Large pothole near the hospital entrance causing traffic issues.',
    category: 'Road',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Adyar',
    landmark: 'Near Apollo Hospital',
    location: 'Adyar, Chennai, Tamil Nadu',
    date: '2024-03-01',
    priority: 'High',
    status: 'Under Review',
    explanation: ['The complaint is marked HIGH priority because it contains safety risk keywords and is located near a sensitive public area.'],
    daysOpen: 4,
    recommendations: ['Road repair inspection', 'Temporary warning sign', 'Public works team visit'],
    department: 'Public Works Department (PWD)',
    departmentEmail: 'pwd@civicpulse.gov',
    estimatedResolution: '3 days',
    aiScore: 82,
    aiConfidence: 94,
    riskLevel: 'High',
    scoreBreakdown: {
      keyword: 30,
      category: 25,
      location: 20,
      time: 7
    },
    decisionFactors: [
      { label: 'Danger keyword detected', icon: 'AlertTriangle' },
      { label: 'Infrastructure/Safety category', icon: 'ShieldAlert' },
      { label: 'Sensitive location nearby', icon: 'MapPin' }
    ]
  },
  {
    id: 'CMP1002',
    title: 'Broken Streetlight',
    description: 'Streetlight is flickering and eventually goes out at night.',
    category: 'Streetlight',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Indiranagar',
    location: 'Indiranagar, Bengaluru Urban, Karnataka',
    date: '2024-03-04',
    priority: 'Low',
    status: 'In Progress',
    explanation: ['The complaint is marked LOW priority as it is a standard maintenance issue with no immediate public safety risk.'],
    daysOpen: 1,
    recommendations: ['Electrical inspection', 'Bulb replacement', 'Maintenance check'],
    department: 'Electricity Department',
    departmentEmail: 'electricity@civicpulse.gov',
    estimatedResolution: '24 hours',
    aiScore: 22,
    aiConfidence: 88,
    riskLevel: 'Low',
    scoreBreakdown: {
      keyword: 0,
      category: 10,
      location: 5,
      time: 7
    },
    decisionFactors: [
      { label: 'Standard maintenance issue', icon: 'Info' }
    ]
  },
  {
    id: 'CMP1003',
    title: 'Water Leakage',
    description: 'Major pipe burst near the school, water flooding the street.',
    category: 'Water',
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    city: 'Srirangam',
    landmark: 'Near Ranganathaswamy Temple',
    location: 'Srirangam, Tiruchirappalli, Tamil Nadu',
    date: '2024-02-25',
    priority: 'Critical',
    status: 'Submitted',
    explanation: ['The complaint is marked CRITICAL priority due to major infrastructure failure near a sensitive public area (school).'],
    daysOpen: 9,
    recommendations: ['Pipe burst inspection', 'Water supply rerouting', 'Emergency plumbing repair'],
    department: 'Water Supply Department',
    departmentEmail: 'water@civicpulse.gov',
    estimatedResolution: '48 hours',
    aiScore: 92,
    aiConfidence: 96,
    riskLevel: 'Critical',
    scoreBreakdown: {
      keyword: 40,
      category: 25,
      location: 20,
      time: 7
    },
    decisionFactors: [
      { label: 'Major infrastructure failure', icon: 'AlertTriangle' },
      { label: 'Sensitive location nearby', icon: 'MapPin' },
      { label: 'Public safety risk', icon: 'ShieldAlert' }
    ]
  },
  {
    id: 'CMP1004',
    title: 'Garbage Pileup',
    description: 'Garbage has not been collected for 3 days in this area.',
    category: 'Garbage',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Kothrud',
    location: 'Kothrud, Pune, Maharashtra',
    date: '2024-03-02',
    priority: 'Medium',
    status: 'Submitted',
    explanation: ['The complaint is marked MEDIUM priority as it involves sanitation issues that could lead to health risks if not addressed.'],
    daysOpen: 3,
    recommendations: ['Sanitation team dispatch', 'Garbage removal', 'Drain cleaning'],
    department: 'Sanitation Department',
    departmentEmail: 'sanitation@civicpulse.gov',
    estimatedResolution: '24 hours',
    aiScore: 47,
    aiConfidence: 91,
    riskLevel: 'Moderate',
    scoreBreakdown: {
      keyword: 10,
      category: 10,
      location: 20,
      time: 7
    },
    decisionFactors: [
      { label: 'Sanitation health risk', icon: 'Droplets' },
      { label: 'Residential area impact', icon: 'MapPin' }
    ]
  }
];

export const DEFAULT_STATE_IMAGE = "https://via.placeholder.com/300x200?text=No+Map+Available";

export const STATE_IMAGES: Record<string, string> = {
  "Tamil Nadu": "https://static.vecteezy.com/system/resources/previews/028/125/522/large_2x/tamil-nadu-3d-district-map-is-a-state-of-india-vector.jpg",
  "Kerala": "https://static.vecteezy.com/system/resources/previews/028/125/536/large_2x/kerala-3d-district-map-is-a-state-of-india-vector.jpg",
  "Karnataka": "https://cdn.vectorstock.com/i/500p/53/09/3d-map-state-india-vector-31535309.jpg",
  "Maharashtra": "https://cdn.vectorstock.com/i/500p/53/64/3d-map-state-india-vector-31535364.jpg",
  "Andhra Pradesh": "https://static.vecteezy.com/system/resources/previews/028/125/526/non_2x/andhra-pradesh-3d-district-map-is-a-state-of-india-vector.jpg",
  "Delhi": "https://static.vecteezy.com/system/resources/previews/028/125/521/original/delhi-3d-district-map-is-a-state-of-india-vector.jpg",
  "Rajasthan": "https://img.freepik.com/premium-vector/rajasthan-3d-district-map-is-state-india_667085-267.jpg?w=360",
  "Gujarat": "https://as1.ftcdn.net/v2/jpg/03/53/39/44/1000_F_353394497_D3xSkS6LQGzK7ZN1moeYWa1XAP0eYgbc.jpg",
  "Telangana": "https://img.freepik.com/premium-vector/telangana-3d-district-map-is-state-india_667085-271.jpg",
  "Punjab": "https://img.freepik.com/premium-vector/punjab-3d-district-map-is-state-india_667085-265.jpg?w=740",
  "Chhattisgarh": "https://static.vecteezy.com/system/resources/previews/028/125/544/original/chhattisgarh-3d-district-map-is-a-state-of-india-vector.jpg",
  "Uttar Pradesh": "https://tse3.mm.bing.net/th/id/OIP.uN_M4XT3JjkoLyoikzRobwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  "West Bengal": "https://static.vecteezy.com/system/resources/previews/028/125/543/non_2x/west-bengal-3d-district-map-is-a-state-of-india-vector.jpg",
  "Jammu and Kashmir": "https://tse2.mm.bing.net/th/id/OIP.ojO42MXTHr5CJKT8saXI_wAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
};
