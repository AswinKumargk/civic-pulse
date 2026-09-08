
export interface City {
  name: string;
}

export interface District {
  name: string;
  cities: string[];
}

export interface State {
  name: string;
  districts: District[];
}

export const INDIA_LOCATIONS: State[] = [
  {
    name: "Tamil Nadu",
    districts: [
      { name: "Chennai", cities: ["Adyar", "Anna Nagar", "T. Nagar", "Velachery", "Mylapore"] },
      { name: "Coimbatore", cities: ["Gandhipuram", "Peelamedu", "RS Puram", "Saravanampatti"] },
      { name: "Madurai", cities: ["Anna Nagar", "K.Pudur", "Sellur", "Simmakkal"] },
      { name: "Tiruchirappalli", cities: ["Srirangam", "Thiruverumbur", "Lalgudi", "Manapparai", "Musiri", "samayapuram", "Thuraiyur", "Tiruverumbur", "Woraiyur", "Kattur", "Ponmalai"] },
      { name: "Salem", cities: ["Fairlands", "Hasthampatti", "Suramangalam"] },
      { name: "Tirunelveli", cities: ["Palayamkottai", "Melapalayam", "Town"] },
      { name: "Vellore", cities: ["Katpadi", "Sathuvachari", "Thorapadi"] },
      { name: "Erode", cities: ["Perundurai", "Bhavani", "Gobichettipalayam"] }
    ]
  },
  {
    name: "Karnataka",
    districts: [
      { name: "Bengaluru Urban", cities: ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield"] },
      { name: "Mysuru", cities: ["Gokulam", "Jayalakshmipuram", "Kuvempunagar"] },
      { name: "Belagavi", cities: ["Tilakwadi", "Shahapur", "Angol"] },
      { name: "Hubballi-Dharwad", cities: ["Vidyanagar", "Keshwapur", "Navanagar"] }
    ]
  },
  {
    name: "Maharashtra",
    districts: [
      { name: "Mumbai City", cities: ["Colaba", "Dadar", "Worli", "Byculla"] },
      { name: "Pune", cities: ["Kothrud", "Baner", "Viman Nagar", "Hinjewadi"] },
      { name: "Nagpur", cities: ["Dharampeth", "Sitabuldi", "Ramdaspeth"] },
      { name: "Thane", cities: ["Ghodbunder Road", "Naupada", "Vartak Nagar"] }
    ]
  },
  {
    name: "Kerala",
    districts: [
      { name: "Thiruvananthapuram", cities: ["Pattom", "Kazhakkoottam", "Vattiyoorkavu"] },
      { name: "Ernakulam", cities: ["Kochi", "Aluva", "Kalamassery"] },
      { name: "Kozhikode", cities: ["Nallalam", "Beypore", "Pantheeramkavu"] }
    ]
  },
  {
    name: "Andhra Pradesh",
    districts: [
      { name: "Visakhapatnam", cities: ["Gajuwaka", "MVP Colony", "Seethammadhara"] },
      { name: "Vijayawada", cities: ["Benz Circle", "Governorpet", "Satyanarayanapuram"] },
      { name: "Guntur", cities: ["Brodipet", "Arundelpet", "Koretipadu"] }
    ]
  },
  {
    name: "Telangana",
    districts: [
      { name: "Hyderabad", cities: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Kukatpally"] },
      { name: "Warangal", cities: ["Hanamkonda", "Kazipet", "Subedari"] }
    ]
  },
  {
    name: "Uttar Pradesh",
    districts: [
      { name: "Lucknow", cities: ["Gomti Nagar", "Aliganj", "Hazratganj"] },
      { name: "Kanpur Nagar", cities: ["Civil Lines", "Kalyanpur", "Kidwai Nagar"] },
      { name: "Varanasi", cities: ["Lanka", "Sigra", "Bhelupur"] },
      { name: "Noida", cities: ["Sector 15", "Sector 18", "Sector 62"] }
    ]
  },
  {
    name: "Gujarat",
    districts: [
      { name: "Ahmedabad", cities: ["Navrangpura", "Satellite", "Vastrapur"] },
      { name: "Surat", cities: ["Adajan", "Vesu", "Varachha"] },
      { name: "Vadodara", cities: ["Alkapuri", "Sayajigunj", "Gotri"] }
    ]
  },
  {
    name: "West Bengal",
    districts: [
      { name: "Kolkata", cities: ["Salt Lake", "Ballygunge", "New Town", "Behala"] },
      { name: "Howrah", cities: ["Shibpur", "Salkia", "Liluah"] },
      { name: "Darjeeling", cities: ["Kurseong", "Kalimpong", "Siliguri"] }
    ]
  },
  {
    name: "Delhi",
    districts: [
      { name: "New Delhi", cities: ["Connaught Place", "Chanakyapuri", "Vasant Kunj"] },
      { name: "South Delhi", cities: ["Saket", "Hauz Khas", "Greater Kailash"] },
      { name: "North Delhi", cities: ["Rohini", "Pitampura", "Model Town"] }
    ]
  },
  { name: "Rajasthan", districts: [{ name: "Jaipur", cities: ["Malviya Nagar", "Vaishali Nagar"] }] },
  { name: "Madhya Pradesh", districts: [{ name: "Indore", cities: ["Vijay Nagar", "Rajwada"] }] },
  { name: "Bihar", districts: [{ name: "Patna", cities: ["Kankarbagh", "Boring Road"] }] },
  { name: "Punjab", districts: [{ name: "Ludhiana", cities: ["Model Town", "Sarabha Nagar"] }] },
  { name: "Haryana", districts: [{ name: "Gurugram", cities: ["DLF Phase 1", "Sushant Lok"] }] },
  { name: "Odisha", districts: [{ name: "Bhubaneswar", cities: ["Nayapalli", "Saheed Nagar"] }] },
  { name: "Assam", districts: [{ name: "Guwahati", cities: ["Dispur", "Paltan Bazaar"] }] },
  { name: "Chhattisgarh", districts: [{ name: "Raipur", cities: ["Tatibandh", "Shankar Nagar"] }] },
  { name: "Jharkhand", districts: [{ name: "Ranchi", cities: ["Lalpur", "Doranda"] }] },
  { name: "Uttarakhand", districts: [{ name: "Dehradun", cities: ["Rajpur Road", "Clement Town"] }] },
  { name: "Himachal Pradesh", districts: [{ name: "Shimla", cities: ["Mall Road", "Chotta Shimla"] }] },
  { name: "Goa", districts: [{ name: "North Goa", cities: ["Panaji", "Mapusa"] }] },
  { name: "Tripura", districts: [{ name: "West Tripura", cities: ["Agartala"] }] },
  { name: "Manipur", districts: [{ name: "Imphal West", cities: ["Imphal"] }] },
  { name: "Meghalaya", districts: [{ name: "East Khasi Hills", cities: ["Shillong"] }] },
  { name: "Nagaland", districts: [{ name: "Kohima", cities: ["Kohima"] }] },
  { name: "Arunachal Pradesh", districts: [{ name: "Itanagar", cities: ["Itanagar"] }] },
  { name: "Mizoram", districts: [{ name: "Aizawl", cities: ["Aizawl"] }] },
  { name: "Sikkim", districts: [{ name: "Gangtok", cities: ["Gangtok"] }] },
  { name: "Andaman and Nicobar Islands", districts: [{ name: "South Andaman", cities: ["Port Blair"] }] },
  { name: "Chandigarh", districts: [{ name: "Chandigarh", cities: ["Sector 17", "Sector 35"] }] },
  { name: "Dadra and Nagar Haveli and Daman and Diu", districts: [{ name: "Daman", cities: ["Daman"] }] },
  { name: "Jammu and Kashmir", districts: [{ name: "Srinagar", cities: ["Lal Chowk"] }, { name: "Jammu", cities: ["Gandhi Nagar"] }] },
  { name: "Ladakh", districts: [{ name: "Leh", cities: ["Leh"] }] },
  { name: "Lakshadweep", districts: [{ name: "Kavaratti", cities: ["Kavaratti"] }] },
  { name: "Puducherry", districts: [{ name: "Puducherry", cities: ["Puducherry"] }] }
];
