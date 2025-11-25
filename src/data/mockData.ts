// Mock data for the Parent Portal

export const mockStudents = [
  { id: 1, name: "Emma Johnson", class: "Grade 5A", year: "2024", avatar: "👧", campus: "Pracha Uthit", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" },
  { id: 2, name: "Liam Johnson", class: "Grade 8B", year: "2024", avatar: "👦", campus: "Pracha Uthit", color: "bg-sky-500/10 border-sky-500/30 text-sky-700" },
  { id: 3, name: "Sophia Johnson", class: "Grade 11C", year: "2024", avatar: "👩‍🎓", campus: "Suvarnabhumi", color: "bg-purple-500/10 border-purple-500/30 text-purple-700" },
];

// Mandatory courses forced by school (pre-selected in cart)
export const mandatoryCourses = [
  {
    id: "mandatory-001",
    name: "Physical Education",
    description: "Required PE course for all students",
    price: 50,
    studentId: "1",
    studentName: "Emma Johnson",
    type: "course" as const,
    isMandatory: true,
    schedule: "Mon & Fri 8:00-9:00 AM",
    location: "Sports Field"
  },
  {
    id: "mandatory-002",
    name: "Library & Research Skills",
    description: "Essential research and information literacy skills",
    price: 40,
    studentId: "2",
    studentName: "Liam Johnson",
    type: "course" as const,
    isMandatory: true,
    schedule: "Tue & Thu 10:00-11:00 AM",
    location: "Library 3F"
  }
];

export const campusList = [
  { id: "pracha-uthit", name: "SISB ประชาอุทิศ", nameEn: "Pracha Uthit" },
  { id: "suvarnabhumi", name: "SISB สุวรรณภูมิ", nameEn: "Suvarnabhumi" },
  { id: "thonburi", name: "SISB ธนบุรี", nameEn: "Thonburi" },
  { id: "chiangmai", name: "SISB เชียงใหม่", nameEn: "Chiangmai" },
  { id: "nonthaburi", name: "SISB นนทบุรี", nameEn: "Nonthaburi" },
  { id: "rayong", name: "SISB ระยอง", nameEn: "Rayong" },
];

export const mockInvoices = [
  {
    id: "INV-2024-001",
    student_id: 1,
    type: "Yearly" as const,
    amount_due: 15500,
    due_date: "2024-12-15",
    status: "pending" as const,
    description: "Invoice Number #INV-2024-001",
    term: "Academic Year 2024-2025"
  },
  {
    id: "INV-2024-005",
    student_id: 2,
    type: "Yearly" as const,
    amount_due: 15500,
    due_date: "2024-12-15",
    status: "paid" as const,
    description: "Invoice Number #INV-2024-005",
    term: "Academic Year 2024-2025"
  },
  {
    id: "INV-2024-006",
    student_id: 3,
    type: "Yearly" as const,
    amount_due: 15500,
    due_date: "2024-12-15",
    status: "pending" as const,
    description: "Invoice Number #INV-2024-006",
    term: "Academic Year 2024-2025"
  }
];

export const mockCreditNotes = [
  {
    id: "CN-2024-001",
    student_id: 1,
    amount: 2500,
    details: "Refund for cancelled swimming course",
    timestamp: "2024-11-15T10:30:00",
    status: "active" as const,
    expiry_date: "2025-12-31"
  },
  {
    id: "CN-2024-002",
    student_id: 2,
    amount: 1800,
    details: "Overpayment adjustment from previous term",
    timestamp: "2024-11-10T14:20:00",
    status: "active" as const,
    expiry_date: "2025-12-31"
  },
  {
    id: "CN-2024-003",
    student_id: 1,
    amount: 500,
    details: "Discount from early payment promotion",
    timestamp: "2024-10-25T09:15:00",
    status: "active" as const,
    expiry_date: "2025-06-30"
  },
  {
    id: "CN-2024-004",
    student_id: 3,
    amount: 3200,
    details: "Refund for cancelled robotics workshop",
    timestamp: "2024-11-01T11:45:00",
    status: "active" as const,
    expiry_date: "2025-12-31"
  }
];


// Student-specific course data
export const mockCoursesData = {
  1: [ // Emma Johnson - Grade 5A
    {
      id: "course-001",
      name: "Creative Art & Design",
      description: "Learn drawing, painting and basic design principles",
      capacity: 15,
      enrolled: 12,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Art Room 201",
      price: 95,
      duration: "8 weeks",
      instructor: "Ms. Jennifer Taylor",
      hasConflict: false
    },
    {
      id: "course-002", 
      name: "Elementary Science Club",
      description: "Fun experiments and discovery activities for young learners",
      capacity: 18,
      enrolled: 14,
      schedule: "Tue & Thu 4:00-5:00 PM",
      location: "Science Lab A",
      price: 110,
      duration: "6 weeks",
      instructor: "Mr. Peter Chen",
      hasConflict: false
    },
    {
      id: "course-003",
      name: "Reading Adventures",
      description: "Develop reading skills through storytelling and book clubs",
      capacity: 12,
      enrolled: 10,
      schedule: "Wed & Fri 3:30-4:30 PM",
      location: "Library Reading Corner",
      price: 85,
      duration: "8 weeks",
      instructor: "Ms. Sarah Johnson",
      hasConflict: false
    },
    {
      id: "course-003-conflict",
      name: "Music Theory Basics",
      description: "Learn fundamental music theory and notation",
      capacity: 15,
      enrolled: 8,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Music Room 105",
      price: 100,
      duration: "8 weeks",
      instructor: "Mr. James Williams",
      hasConflict: true
    }
  ],
  2: [ // Liam Johnson - Grade 8B
    {
      id: "course-004",
      name: "Advanced Mathematics Club",
      description: "Explore advanced mathematical concepts and problem-solving techniques",
      capacity: 20,
      enrolled: 18,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Math Lab Room 205",
      price: 120,
      duration: "8 weeks",
      instructor: "Dr. Sarah Wilson",
      hasConflict: false
    },
    {
      id: "course-005",
      name: "Robotics Engineering",
      description: "Learn programming and build robots using LEGO Mindstorms",
      capacity: 12,
      enrolled: 12,
      schedule: "Wed & Fri 3:30-5:00 PM",
      location: "STEM Lab Room 101",
      price: 180,
      duration: "10 weeks",
      instructor: "Mr. David Kim",
      hasConflict: false
    },
    {
      id: "course-006",
      name: "Digital Photography",
      description: "Learn photography techniques and digital editing",
      capacity: 15,
      enrolled: 11,
      schedule: "Tue & Thu 4:00-5:30 PM",
      location: "Media Lab Room 305",
      price: 140,
      duration: "8 weeks",
      instructor: "Ms. Rachel Martinez",
      hasConflict: false
    },
    {
      id: "course-006-conflict",
      name: "Spanish Language",
      description: "Introduction to Spanish language and culture",
      capacity: 18,
      enrolled: 14,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Language Lab 210",
      price: 130,
      duration: "8 weeks",
      instructor: "Señora Maria Garcia",
      hasConflict: true
    }
  ],
  3: [ // Sophia Johnson - Grade 11C
    {
      id: "course-007",
      name: "Academic Writing Workshop",
      description: "Develop advanced writing skills for college preparation",
      capacity: 15,
      enrolled: 13,
      schedule: "Mon & Wed 4:00-5:30 PM",
      location: "English Department Room 402",
      price: 160,
      duration: "10 weeks",
      instructor: "Dr. Emily Roberts",
      hasConflict: false
    },
    {
      id: "course-008",
      name: "Advanced Biology Lab",
      description: "Hands-on laboratory experiments and research projects",
      capacity: 18,
      enrolled: 16,
      schedule: "Tue & Thu 3:30-5:00 PM",
      location: "Biology Lab Room 501",
      price: 200,
      duration: "12 weeks",
      instructor: "Dr. Michael Thompson",
      hasConflict: false
    },
    {
      id: "course-009",
      name: "Leadership & Communication",
      description: "Develop leadership skills and public speaking abilities",
      capacity: 20,
      enrolled: 17,
      schedule: "Wed & Fri 4:00-5:30 PM",
      location: "Conference Room B",
      price: 175,
      duration: "8 weeks",
      instructor: "Ms. Amanda Lee",
      hasConflict: true
    }
  ]
};

// Student-specific summer activities data
export const mockSummerActivitiesData = {
  1: [ // Emma Johnson - Grade 5A
    {
      id: "summer-001",
      name: "Junior Art Camp",
      description: "Creative arts and crafts for younger students",
      capacity: 20,
      enrolled: 15,
      schedule: "July 8-19, 9:00 AM - 1:00 PM",
      location: "Art Studio Room 201",
      price: 350,
      duration: "2 weeks",
      instructor: "Ms. Jennifer Taylor",
      discount: "Early Bird: $30 off"
    },
    {
      id: "summer-002",
      name: "Nature Explorer Camp",
      description: "Outdoor adventures and environmental learning",
      capacity: 25,
      enrolled: 18,
      schedule: "July 22 - Aug 2, 9:00 AM - 2:00 PM",
      location: "Outdoor Campus & Nature Trail",
      price: 420,
      duration: "2 weeks", 
      instructor: "Mr. Tom Wilson",
      discount: "Sibling Discount: 10% off"
    }
  ],
  2: [ // Liam Johnson - Grade 8B
    {
      id: "summer-003",
      name: "Robotics & Coding Camp",
      description: "Advanced programming and robot building",
      capacity: 15,
      enrolled: 12,
      schedule: "July 8-19, 9:00 AM - 3:00 PM",
      location: "STEM Lab & Computer Center",
      price: 550,
      duration: "2 weeks",
      instructor: "Tech Team",
      discount: "Early Bird: $75 off"
    },
    {
      id: "summer-004",
      name: "Soccer Skills Academy",
      description: "Improve soccer techniques and teamwork",
      capacity: 30,
      enrolled: 28,
      schedule: "Aug 5-16, 8:00 AM - 12:00 PM",
      location: "Sports Field Complex",
      price: 320,
      duration: "2 weeks",
      instructor: "Coach Michael Rodriguez"
    },
    {
      id: "summer-005",
      name: "Science Discovery Camp",
      description: "Hands-on experiments and laboratory work",
      capacity: 20,
      enrolled: 16,
      schedule: "July 22 - Aug 2, 10:00 AM - 3:00 PM",
      location: "Science Building Lab",
      price: 480,
      duration: "2 weeks",
      instructor: "Science Department"
    }
  ],
  3: [ // Sophia Johnson - Grade 11C
    {
      id: "summer-006",
      name: "College Prep Intensive",
      description: "SAT/ACT preparation and college application workshop",
      capacity: 25,
      enrolled: 22,
      schedule: "July 8-26, 9:00 AM - 2:00 PM",
      location: "Academic Center Room 501",
      price: 650,
      duration: "3 weeks",
      instructor: "College Counseling Team",
      discount: "Merit Scholarship: $100 off"
    },
    {
      id: "summer-007",
      name: "Advanced Biology Research",
      description: "Independent research projects and lab work",
      capacity: 12,
      enrolled: 8,
      schedule: "July 15 - Aug 9, 1:00 PM - 5:00 PM",
      location: "Advanced Biology Lab",
      price: 580,
      duration: "4 weeks", 
      instructor: "Dr. Lisa Chang",
      discount: "Research Grant: $50 off"
    },
    {
      id: "summer-008",
      name: "Leadership Summit",
      description: "Leadership skills development and community service",
      capacity: 20,
      enrolled: 15,
      schedule: "Aug 12-23, 10:00 AM - 4:00 PM",
      location: "Conference Center",
      price: 520,
      duration: "2 weeks",
      instructor: "Leadership Institute"
    }
  ]
};

// Legacy exports for backward compatibility
export const mockCourses = mockCoursesData[1];
export const mockSummerActivities = mockSummerActivitiesData[1];

export const mockReceipts = [
  {
    id: "REC-2024-001",
    invoice_id: "INV-2024-004",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2024",
    amount: 3200,
    payment_method: "credit_card" as const,
    paid_at: "2024-08-28T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "September Tuition Payment",
    reference_number: "TXN-20240828-001"
  },
  {
    id: "REC-2024-002",
    invoice_id: "INV-2024-005",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2024",
    amount: 850,
    payment_method: "bank_transfer" as const,
    paid_at: "2024-08-25T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Activity Registration Fee",
    reference_number: "TXN-20240825-002"
  },
  {
    id: "REC-2024-003",
    invoice_id: "INV-2024-006",
    student_id: 3,
    studentName: "Sophia Johnson",
    year: "2024",
    amount: 450,
    payment_method: "bank_transfer" as const,
    paid_at: "2024-08-20T09:45:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Summer Camp Registration",
    reference_number: "TXN-20240820-003"
  },
  {
    id: "REC-2024-004",
    invoice_id: "INV-2024-007",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2024",
    amount: 12800,
    payment_method: "credit_card" as const,
    paid_at: "2024-08-30T16:20:00Z",
    receipt_url: "#",
    status: "processing" as const,
    description: "Tuition Fee",
    reference_number: "TXN-20240830-004"
  },
  {
    id: "REC-2023-001",
    invoice_id: "INV-2023-001",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2023",
    amount: 2800,
    payment_method: "bank_transfer" as const,
    paid_at: "2023-08-15T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "August Tuition Payment",
    reference_number: "TXN-20230815-001"
  },
  {
    id: "REC-2023-002",
    invoice_id: "INV-2023-002",
    student_id: 3,
    studentName: "Sophia Johnson",
    year: "2023",
    amount: 15500,
    payment_method: "credit_card" as const,
    paid_at: "2023-07-20T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Yearly Tuition Fee 2023-2024",
    reference_number: "TXN-20230720-002"
  }
];

export const getMockDataForStudent = (studentId: number) => {
  const invoices = mockInvoices.filter(inv => inv.student_id === studentId);
  
  return {
    invoices,
    courses: mockCoursesData[studentId] || mockCoursesData[1],
    summerActivities: mockSummerActivitiesData[studentId] || mockSummerActivitiesData[1],
    receipts: mockReceipts
  };
};