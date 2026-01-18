import axios from "axios";

// ✅ API base (client-safe)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://seta-management-api-fvzc9.ondigitalocean.app";

// ✅ Shared axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ONLY keep if backend supports cookies correctly
  timeout: 15000, // prevent 504 hanging forever
});

// ✅ Safe request helper (never throws)
const safeGet = async (url) => {
  try {
    const res = await api.get(url);
    return res.data ?? {};
  } catch (err) {
    console.error(`API failed: ${url}`, {
      status: err.response?.status,
      message: err.message,
    });
    return {};
  }
};

/**
 * Fetch students data safely
 * CALL ONLY inside useEffect / event handlers / SSR
 */
export const generateStudents = async () => {
  if (!API_BASE) {
    console.warn("API_BASE is undefined");
    return [];
  }

  // ✅ Fetch endpoints safely (no Promise.all crash)
  const studentsData = await safeGet("/api/administrators/students");
  const biographicsData = await safeGet("/api/administrators/biographics");
  const setasData = await safeGet("/api/administrators/setas");
  const companiesData = await safeGet("/api/administrators/host-companies");

  const students = studentsData.students ?? [];
  const biographics = biographicsData.biographics ?? [];
  const setas = setasData.setas ?? [];
  const companies = companiesData.companies ?? [];

  // ✅ Index related data
  const bioMap = Object.fromEntries(
    biographics.map((b) => [b.user_id, b])
  );

  const setaMap = Object.fromEntries(
    setas.map((s) => [s.id, s])
  );

  const companyMap = Object.fromEntries(
    companies.map((c) => [c.id, c])
  );

  // ✅ Normalize student records
  return students.map((student) => {
    const bio = bioMap[student.id] || {};
    const seta = setaMap[student.seta_id] || {};
    const company = companyMap[student.company_id] || {};

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

      idNumber:
        student.ID_number ??
        student.id_number ??
        null,

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        student.first_name + " " + student.last_name
      )}&background=0245A3&color=ffffff&size=128`,

      // ✅ Biographics
      dateOfBirth: bio.date_of_birth ?? null,
      gender: bio.gender ?? null,
      physicalAddress: bio.address ?? null,

      // UI extras
      nationality: "South African",
      learnerships: student.programme
        ? `${student.programme} Learnership`
        : null,

      stipendAmount: null,
      lastPayment: null,
      nextPayment: null,
    };
  });
};