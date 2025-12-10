const generateStudents = (count) => {
  const programmes = [
    'National Certificate: IT Systems Support', 
    'National Diploma: Software Development', 
    'Certificate: Data Analytics', 
    'Diploma: Business Administration', 
    'Certificate: Project Management'
  ];
  
  const faculties = [
    'Faculty of Information Technology',
    'Faculty of Business & Management',
    'Faculty of Engineering',
    'Faculty of Commerce',
    'Faculty of Applied Sciences'
  ];
  
  const statuses = ['Active', 'Completed', 'On Hold', 'Withdrawn', 'Suspended'];
  const setas = ['SERVICES SETA', 'ETDP SETA', 'MICT SETA', 'BANKSETA', 'FASSET'];
  const stipendStatuses = ['Paid', 'Pending', 'Overdue', 'Not Applicable'];
  const complianceStatuses = ['Compliant', 'At Risk', 'Non-Compliant'];
  
  const employers = [
    'Tech Solutions Ltd', 'Business Dynamics', 'Innovation Hub',
    'Digital Systems Corp', 'Enterprise Solutions', 'SmartTech SA',
    'Global Industries', 'Future Ventures', 'Prime Consulting'
  ];
  
  const firstNames = ['Thabo', 'Lerato', 'Sipho', 'Nomsa', 'Kwame', 'Zinhle', 'Bongani', 'Thandi', 'Mpho', 'Ayanda'];
  const lastNames = ['Nkosi', 'Dlamini', 'Mokoena', 'Khumalo', 'Mthembu', 'Ndlovu', 'Zulu', 'Mahlangu', 'Molefe', 'Sithole'];
  
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const programme = programmes[Math.floor(Math.random() * programmes.length)];
    const faculty = faculties[Math.floor(Math.random() * faculties.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const seta = setas[Math.floor(Math.random() * setas.length)];
    const employer = employers[Math.floor(Math.random() * employers.length)];
    const attendance = Math.floor(Math.random() * 40) + 60;
    const compliance = attendance >= 80 ? 'Compliant' : attendance >= 70 ? 'At Risk' : 'Non-Compliant';
    const stipendStatus = stipendStatuses[Math.floor(Math.random() * stipendStatuses.length)];
    

    const year = Math.floor(Math.random() * 30) + 90; 
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const idNumber = `${year}${month}${day}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}0${Math.floor(Math.random() * 10)}0`;
    
    students.push({
      id: i,
      studentNr: `STU${String(i).padStart(6, '0')}`,
      studentNumber: `STU${String(i).padStart(6, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.ac.za`,
      personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      phone: `+27 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      programme: programme,
      faculty: faculty,
      status: status,
      seta: seta,
      setaName: seta,
      employer: employer,
      employerName: employer,
      supervisor: `${firstNames[Math.floor(Math.random() * firstNames.length)]} Manager`,
      attendance: attendance,
      compliance: compliance,
      stipendStatus: stipendStatus,
      idNumber: idNumber,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0245A3&color=ffffff&size=128`,
      

      dateOfBirth: `19${year}-${month}-${day}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      race: ['African', 'Coloured', 'Indian/Asian', 'White'][Math.floor(Math.random() * 4)],
      nationality: 'South African',
      physicalAddress: `${Math.floor(Math.random() * 999) + 1} Main Street, Johannesburg, ${Math.floor(Math.random() * 9000) + 1000}`,
      learnerships: `${programme} Learnership`,
      stipendAmount: `R ${Math.floor(Math.random() * 2000) + 2000}`,
      lastPayment: '2024-10-01',
      nextPayment: '2024-11-01'
    });
  }
  
  return students;
};

export { generateStudents };