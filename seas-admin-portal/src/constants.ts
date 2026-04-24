export type PaymentStatus = 'PENDING' | 'UNDER REVIEW' | 'FLAGGED' | 'VERIFIED';

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  appId: string;
  method: 'Receipt Upload' | 'Bank Transfer';
  amount: string;
  txnId: string;
  date: string;
  status: PaymentStatus;
  location: string;
  school: string;
  program: string;
  email: string;
  address: string;
  dob: string;
  nationality: string;
  technicalCompetencies: string[];
  activityLog: {
    title: string;
    date: string;
    user?: string;
    isSystem?: boolean;
    isPending?: boolean;
  }[];
}

export const CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Aditi Mukherjee',
    initials: 'AM',
    appId: 'APP-2023-8812',
    method: 'Receipt Upload',
    amount: '$120.00',
    txnId: 'TXN-992811AB',
    date: 'Oct 26, 14:22',
    status: 'PENDING',
    location: 'Mumbai, India',
    school: 'Engineering Excellence',
    program: 'M.S. Robotics',
    email: 'aditi.m@example.edu',
    address: 'Flat 402, Skyline Towers, Andheri East, Mumbai, MH 400069, India',
    dob: '12 June 2000',
    nationality: 'Indian',
    technicalCompetencies: ['Python', 'C++', 'Java'],
    activityLog: [
      { title: 'Application Submitted', date: 'Oct 24, 2023 • 10:15 AM', isSystem: true },
      { title: 'Payment Receipt Uploaded', date: 'Oct 26, 2023 • 14:22 PM' }
    ]
  },
  {
    id: '2',
    name: 'David Lawson',
    initials: 'DL',
    appId: 'APP-2023-9014',
    method: 'Bank Transfer',
    amount: '$120.00',
    txnId: 'TXN-001244PQ',
    date: 'Oct 26, 11:05',
    status: 'UNDER REVIEW',
    location: 'London, UK',
    school: 'Global Institute',
    program: 'B.Sc Computer Science',
    email: 'd.lawson@example.edu',
    address: '22 Baker Street, London, NW1 6XE, United Kingdom',
    dob: '15 March 1999',
    nationality: 'British',
    technicalCompetencies: ['React', 'Node.js', 'AWS'],
    activityLog: [
      { title: 'Application Submitted', date: 'Oct 24, 2023 • 09:30 AM', isSystem: true },
      { title: 'Bank Transfer Initiated', date: 'Oct 25, 2023 • 16:10 PM' },
      { title: 'Verification: Personal ID Approved', date: 'Oct 26, 2023 • 09:15 AM', user: 'Dr. J. Vance' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Kalu',
    initials: 'SK',
    appId: 'APP-2023-7762',
    method: 'Receipt Upload',
    amount: '$120.00',
    txnId: 'TXN-REF-7122',
    date: 'Oct 25, 09:30',
    status: 'FLAGGED',
    location: 'Lagos, Nigeria',
    school: 'West African Tech',
    program: 'M.Eng Civil Engineering',
    email: 's.kalu@example.edu',
    address: '15 Victoria Island, Lagos, Nigeria',
    dob: '22 Sept 1998',
    nationality: 'Nigerian',
    technicalCompetencies: ['AutoCAD', 'Revit', 'SAP2000'],
    activityLog: [
      { title: 'Application Submitted', date: 'Oct 23, 2023 • 11:45 AM', isSystem: true },
      { title: 'Payment Flagged: Duplicate Transaction ID', date: 'Oct 25, 2023 • 09:30 AM', user: 'System' }
    ]
  },
  {
    id: '4',
    name: 'Arjun Mehta',
    initials: 'AM',
    appId: 'SEAS-2024-8842',
    method: 'Receipt Upload',
    amount: '$120.00',
    txnId: 'TXN-REF-8842',
    date: 'Oct 24, 14:32',
    status: 'PENDING',
    location: 'Mumbai, India',
    school: 'Engineering Excellence',
    program: 'M.S. Robotics',
    email: 'arjun.mehta@example.edu',
    address: '42, Crystal Enclave, Powai, Mumbai, Maharashtra 400076, India',
    dob: '14 May 1999',
    nationality: 'Indian',
    technicalCompetencies: ['Python (Advanced)', 'ROS2', 'C++', 'MATLAB'],
    activityLog: [
      { title: 'System: Application Submitted', date: 'Aug 24, 2024 • 14:32 PM', isSystem: true },
      { title: 'Verification: Personal ID Approved', date: 'Aug 25, 2024 • 09:15 AM', user: 'Dr. J. Vance' },
      { title: 'Awaiting Academic Verification...', date: '-', isPending: true }
    ]
  }
];
