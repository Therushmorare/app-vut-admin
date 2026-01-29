import axios from "axios";

// API base (client-safe)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://seta-management-api-fvzc9.ondigitalocean.app";

// Shared axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
});

// Safe request helper
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

// Document type → frontend key mapping
const DOC_TYPE_MAP = {
  idDocument: "idDocument",
  proofOfResidence: "proofOfResidence",
  academicTranscript: "academicTranscript",
  cv: "cv",
  bankStatement: "bankStatement",
};

/**
 * Fetch students data safely
 */
export const generateStudents = async () => {
  if (!API_BASE) {
    console.warn("API_BASE is undefined");
    return [];
  }

  const studentsData = await safeGet("/api/administrators/students");
  const biographicsData = await safeGet("/api/administrators/biographics");
  const setasData = await safeGet("/api/administrators/setas");
  const companiesData = await safeGet("/api/administrators/host-companies");
  const bankingData = await safeGet("/api/administrators/bankingDetails");
  const documentsData = await safeGet("/api/administrators/studentDocuments");

  const students = studentsData.students ?? [];
  const biographics = biographicsData.biographics ?? [];
  const setas = setasData.setas ?? [];
  const companies = companiesData.companies ?? [];
  const banking = bankingData.banking ?? [];
  const docs = Array.isArray(documentsData) ? documentsData : [];

  // Index maps
  const bioMap = Object.fromEntries(
    biographics.map((b) => [b.user_id, b])
  );

  const setaMap = Object.fromEntries(
    setas.map((s) => [s.id, s])
  );

  const companyMap = Object.fromEntries(
    companies.map((c) => [c.id, c])
  );

  const bankMap = Object.fromEntries(
    banking.map((b) => [b.user_id, b])
  );

  // Documents grouped per user
  const docMap = {};

  docs.forEach((d) => {
    const key = DOC_TYPE_MAP[d.doc_type];
    if (!key) return;

    if (!docMap[d.user_id]) {
      docMap[d.user_id] = {};
    }

    docMap[d.user_id][key] = {
      status: "Uploaded",
      url: d.document,
      documentId: d.document_id,
    };
  });

  // Normalize students
  return students.map((student) => {
    const bioData = bioMap[student.id] || {};
    const seta = setaMap[student.seta_id] || {};
    const company = companyMap[student.company_id] || {};
    const bank = bankMap[student.id] || {};
    const studentDocs = docMap[student.id] || {}
    const attendance = Math.floor(Math.random() * 40) + 60;

    return {
      id: student.id,
      studentNr: student.id,
      studentNumber: student.student_number,

      name: `${student.first_name} ${student.last_name}`,
      email: student.email,
      personalEmail: student.email,
      phone: student.phone_number,

      programme: student.programme,
      faculty: student.faculty,
      status: student.status,

      bankName: bank.bank_name,
      accountNumber: bank.account_number,

      learnerAgreement: "Uploaded - Verified",
      idCopy: studentDocs.idDocument ?? null,
      proofOfResidence: studentDocs.proofOfResidence ?? null,
      priorQualifications: studentDocs.academicTranscript ?? null,
      cv: studentDocs.cv ?? null,
      bankStatement: studentDocs.bankStatement ?? null,

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

      dateOfBirth: bioData.date_of_birth ?? null,
      gender: bioData.gender ?? null,
      physicalAddress: bioData.address ?? null,
      postalAddress: bioData.address ?? null,

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