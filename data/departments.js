// ======================================================
// University Departments Data
// ======================================================

const departments = {
  'Faculty of Science and Engineering': [
    { id: 1, name: 'Department of Civil Engineering', code: 'CE', faculty: 'FSE' },
    { id: 2, name: 'Department of EEE', code: 'EEE', faculty: 'FSE' },
    { id: 3, name: 'Department of CSE', code: 'CSE', faculty: 'FSE' },
    { id: 4, name: 'Department of Pharmacy', code: 'PHM', faculty: 'FSE' },
    { id: 5, name: 'Department of Microbiology', code: 'MCB', faculty: 'FSE' },
    { id: 6, name: 'Department of Biochemistry and Molecular Biology', code: 'BMB', faculty: 'FSE' }
  ],
  'Faculty of Arts and Social Sciences': [
    { id: 7, name: 'Department of English', code: 'ENG', faculty: 'FASS' },
    { id: 8, name: 'Department of Political Science', code: 'PS', faculty: 'FASS' },
    { id: 9, name: 'Department of Sociology', code: 'SOC', faculty: 'FASS' },
    { id: 10, name: 'Department of Economics', code: 'ECO', faculty: 'FASS' },
    { id: 11, name: 'Department of Development Studies', code: 'DS', faculty: 'FASS' }
  ],
  'Faculty of Business Studies': [
    { id: 12, name: 'Department of Business Administration', code: 'BBA', faculty: 'FBS' }
  ],
  'Faculty of Law': [
    { id: 13, name: 'Department of Law', code: 'LAW', faculty: 'FL' }
  ]
};

// Flat list of all departments
const allDepartments = [
  ...departments['Faculty of Science and Engineering'],
  ...departments['Faculty of Arts and Social Sciences'],
  ...departments['Faculty of Business Studies'],
  ...departments['Faculty of Law']
];

module.exports = {
  departments,
  allDepartments
};
