import type { DateGroup } from "@/features/leads/types";

export const AVATAR_COLORS = [
  "#b879ff","#ffae4c","#537ff1","#b6ca00","#3cc3df","#50c796",
  "#57b7ec","#e16540","#47d096","#328efa","#ff6b6b","#ffd93d",
];

export const ALL_CAMPAIGNS = [
  "Summer Sale 2026 — Active",
  "New Leads May Batch — Active",
  "Bulk Buyers Q2 — Paused",
  "Reseller Outreach — Active",
  "Enterprise Pipeline — Draft",
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const RAW_LEADS: { date: string; leads: Omit<DateGroup["leads"][number], "id" | "avatar" | "color">[] }[] = [
  {
    date: "Today",
    leads: [
      { name: "Ankit Sharma",   mobile: "+91 98765 43210", location: "Mumbai",    summary: "Interested in bulk order for 500 units." },
      { name: "Priya Verma",    mobile: "+91 87654 32109", location: "Delhi",     summary: "Asked about pricing for premium range." },
      { name: "Ravi Kumar",     mobile: "+91 76543 21098", location: "Bangalore", summary: "Wants demo of enterprise plan." },
      { name: "Sneha Patel",    mobile: "+91 65432 10987", location: "Ahmedabad", summary: "Looking for distributor partnership." },
      { name: "Mohit Joshi",    mobile: "+91 54321 09876", location: "Jaipur",    summary: "Asked for product catalog and pricing." },
      { name: "Kavita Singh",   mobile: "+91 43210 98765", location: "Lucknow",   summary: "Needs GST invoice for bulk purchase." },
      { name: "Deepak Gupta",   mobile: "+91 32109 87654", location: "Pune",      summary: "Interested in annual subscription." },
      { name: "Anjali Mehta",   mobile: "+91 21098 76543", location: "Surat",     summary: "Follow-up on previous inquiry." },
      { name: "Vikas Yadav",    mobile: "+91 10987 65432", location: "Indore",    summary: "Requested callback for negotiation." },
      { name: "Pooja Agarwal",  mobile: "+91 99876 54321", location: "Bhopal",    summary: "Interested in monthly plan." },
    ],
  },
  {
    date: "Yesterday",
    leads: [
      { name: "Suresh Nair",    mobile: "+91 98761 11234", location: "Chennai",   summary: "Wants reseller agreement details." },
      { name: "Meena Pillai",   mobile: "+91 87651 22345", location: "Kochi",     summary: "Interested in whitelabel solution." },
      { name: "Arjun Das",      mobile: "+91 76541 33456", location: "Kolkata",   summary: "Asked about API integration options." },
      { name: "Lakshmi Iyer",   mobile: "+91 65431 44567", location: "Hyderabad", summary: "Needs 200-unit quote urgently." },
      { name: "Kiran Reddy",    mobile: "+91 54321 55678", location: "Vizag",     summary: "Looking for SaaS plan for team." },
      { name: "Ramesh Gowda",   mobile: "+91 43211 66789", location: "Mysore",    summary: "Asked about data privacy policy." },
      { name: "Suma Rao",       mobile: "+91 32101 77890", location: "Mangalore", summary: "Wants trial extension for pilot." },
      { name: "Naveen Shetty",  mobile: "+91 21091 88901", location: "Hubli",     summary: "Interested in educational license." },
    ],
  },
  {
    date: "02 May",
    leads: [
      { name: "Farhan Sheikh",  mobile: "+91 98763 31234", location: "Nagpur",     summary: "Bulk purchase inquiry for 1000 units." },
      { name: "Zara Qureshi",   mobile: "+91 87653 42345", location: "Aurangabad", summary: "Looking for exclusive dealer rights." },
      { name: "Imran Malik",    mobile: "+91 76543 53456", location: "Nashik",     summary: "Wants custom integration built." },
      { name: "Aisha Khan",     mobile: "+91 65433 64567", location: "Solapur",    summary: "Needs compliance documentation." },
      { name: "Yusuf Ali",      mobile: "+91 54323 75678", location: "Kolhapur",   summary: "Asked about payment terms." },
      { name: "Fatima Begum",   mobile: "+91 43213 86789", location: "Sangli",     summary: "Interested in pilot program." },
      { name: "Ahmed Raza",     mobile: "+91 32103 97890", location: "Satara",     summary: "Follow-up after product demo." },
    ],
  },
  {
    date: "01 May",
    leads: [
      { name: "Gurpreet Singh",  mobile: "+91 98764 41234", location: "Amritsar",  summary: "Wants volume discount for 300 units." },
      { name: "Harpreet Kaur",   mobile: "+91 87654 52345", location: "Ludhiana",  summary: "Interested in referral program." },
      { name: "Manpreet Gill",   mobile: "+91 76544 63456", location: "Chandigarh",summary: "Needs demo for management team." },
      { name: "Simran Bhatia",   mobile: "+91 65434 74567", location: "Jalandhar", summary: "Asked about onboarding timeline." },
      { name: "Rajinder Arora",  mobile: "+91 54324 85678", location: "Patiala",   summary: "Looking for multi-location support." },
      { name: "Paramjit Saini",  mobile: "+91 43214 96789", location: "Bathinda",  summary: "Interested in training package." },
    ],
  },
  {
    date: "30 Apr",
    leads: [
      { name: "Tanya Desai",    mobile: "+91 98762 51234", location: "Vadodara",   summary: "Wants trial for 2 weeks." },
      { name: "Harsh Shah",     mobile: "+91 87652 62345", location: "Rajkot",     summary: "Interested in yearly subscription." },
      { name: "Nisha Trivedi",  mobile: "+91 76542 73456", location: "Bhavnagar",  summary: "Needs product comparison sheet." },
      { name: "Chirag Pandya",  mobile: "+91 65432 84567", location: "Anand",      summary: "Wants to speak with sales lead." },
      { name: "Mital Jain",     mobile: "+91 54322 95678", location: "Gandhinagar",summary: "Interested in startup discount." },
      { name: "Dhruv Kapoor",   mobile: "+91 43212 06789", location: "Mehsana",    summary: "Follow-up on pricing email." },
    ],
  },
  {
    date: "29 Apr",
    leads: [
      { name: "Vikram Chaudhary", mobile: "+91 98761 61234", location: "Agra",       summary: "Interested in reseller model." },
      { name: "Geeta Mishra",     mobile: "+91 87651 72345", location: "Meerut",     summary: "Asked about support SLA." },
      { name: "Rajesh Tiwari",    mobile: "+91 76541 83456", location: "Varanasi",   summary: "Needs pricing for 50-seat plan." },
      { name: "Sunita Pandey",    mobile: "+91 65431 94567", location: "Kanpur",     summary: "Wants feature-by-feature comparison." },
      { name: "Arun Saxena",      mobile: "+91 54321 05678", location: "Allahabad",  summary: "Interested in self-hosted option." },
    ],
  },
];

let _id = 1;
export const DATE_GROUPS: DateGroup[] = RAW_LEADS.map(({ date, leads }) => ({
  label: date,
  leads: leads.map((l, i) => ({
    ...l,
    id: _id++,
    avatar: initials(l.name),
    color: AVATAR_COLORS[(i + date.length) % AVATAR_COLORS.length],
  })),
}));

export const ALL_DATES = DATE_GROUPS.map((g) => g.label);
