import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://seta-management-api-5zwfv.ondigitalocean.app";

const generateStudents = async () => {
  try {
    const [
      studentsRes,
      biographicsRes,
      setasRes,
      companiesRes
    ] = await Promise.all([
      axios.get(`${API_BASE}/api/administrators/students`, { withCredentials: true }),
      axios.get(`${API_BASE}/api/administrators/biographics`, { withCredentials: true }),
      axios.get(`${API_BASE}/api/administrators/setas`, { withCredentials: true }),
      axios.get(`${API_BASE}/api/administrators/host-companies`, { withCredentials: true }),
    ]);

    const students = studentsRes.data.students || [];
    const biographics = biographicsRes.data.biographics || [];
    const setas = setasRes.data.setas || [];
    const companies = companiesRes.data.companies || [];

    // Index biographics by user_id for fast lookup
    const bioMap = Object.fromEntries(
      biographics.map(b => [b.user_id, b])
    );

    return students.map(student => {
      const bio = bioMap[student.id] || {};
      const seta = setas[Math.floor(Math.random() * setas.length)] || {};
      const company = companies[Math.floor(Math.random() * companies.length)] || {};

      const attendance = Math.floor(Math.random() * 40) + 60;

      return {
        id: student.id,
        studentNr: student.student_number,
        studentNumber: student.student_number,

        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
        personalEmail: student.email,
        phone: student.phone_number,

        programme: student.programme,
        faculty: student.faculty,
        status: student.status,

        seta: seta.name || "N/A",
        setaName: seta.name || "N/A",

        employer: company.company_name || "N/A",
        employerName: company.company_name || "N/A",
        supervisor: company.contact_person || "Not Assigned",

        attendance,
        compliance:
          attendance >= 80
            ? "Compliant"
            : attendance >= 70
            ? "At Risk"
            : "Non-Compliant",

        stipendStatus: "Pending",

        idNumber: student.ID_number,

        avatar: `https://ui-avatars.com/api/?name=${student.first_name}+${student.last_name}&background=0245A3&color=ffffff&size=128`,

        // Biographics
        dateOfBirth: bio.date_of_birth || null,
        gender: bio.gender || null,
        physicalAddress: bio.address || null,

        // Optional UI fields
        nationality: "South African",
        learnerships: student.programme
          ? `${student.programme} Learnership`
          : null,

        stipendAmount: null,
        lastPayment: null,
        nextPayment: null
      };
    });
  } catch (error) {
    console.error("Student API integration failed:", error);
    return [];
  }
};

export { generateStudents };