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
  const allocationsData = await safeGet("/api/administrators/learner-allocations");
  const agreementsData = await safeGet("/api/administrators/setaAgreements");
  const placementsData = await safeGet("/api/administrators/learner-placements");

  const students = studentsData.students ?? [];
  const biographics = biographicsData.biographics ?? [];
  const setas = setasData.setas ?? [];
  const companies = companiesData.companies ?? [];
  const banking = Array.isArray(bankingData) ? banking : [];
  const docs = Array.isArray(documentsData) ? documentsData : [];
  const allocations = allocationsData.allocations ?? [];
  const agreements = Array.isArray(agreementsData) ? agreementsData : [];
  const placements = placementsData.placements ?? [];

  // Index maps
  const bioMap = Object.fromEntries(
    biographics.map((b) => [b.user_id, b])
  );

  const setaMap = Object.fromEntries(
    setas.map((s) => [s.id, s])
  );

  const companyMap = Object.fromEntries(
    companies.map(c => [c.company_id, c])
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

  const allocationMap = {};
    allocations.forEach(a => {
      allocationMap[a.student_id] = a;
  });

  const agreementMap = {};
  agreements.forEach(a => {
    agreementMap[a.agreement_id] = a;
  });

  const placementMap = {};
  placements.forEach(p => {
    placementMap[p.student_id] = p;
  });

  // Normalize students
  return students.map((student) => {
    const bioData = bioMap[student.id] || {};
    const bank = bankMap[student.id] || {};
    const studentDocs = docMap[student.id] || {};

    const allocation = allocationMap[student.id] || null;
    const agreement = allocation
      ? agreementMap[allocation.agreement_id]
      : null;

    const placement = placementMap[student.id] || null;
    const company = placement
      ? companyMap[placement.company_id]
      : null;

    const attendance = Math.floor(Math.random() * 40) + 60;

    return {
      /* ------------------ IDENTIFIERS ------------------ */
      id: student.id,
      studentNr: student.id,
      studentNumber: student.student_number,

      /* ------------------ BASIC INFO ------------------ */
      name: `${student.first_name} ${student.last_name}`,
      email: student.email,
      personalEmail: student.email,
      phone: student.phone_number,

      programme: student.programme,
      faculty: agreement?.faculty ?? "N/A",
      status: student.status,

      /* ------------------ BANKING ------------------ */
      bankName: bank.bank_name ?? null,
      accountNumber: bank.account_number ?? null,

      /* ------------------ DOCUMENTS ------------------ */
      learnerAgreement: agreement
        ? "Uploaded - Active"
        : "Not Allocated",

      learnerAgreementFile: agreement?.file_url ?? null,

      idCopy: studentDocs.idDocument ?? null,
      proofOfResidence: studentDocs.proofOfResidence ?? null,
      priorQualifications: studentDocs.academicTranscript ?? null,
      cv: studentDocs.cv ?? null,
      bankStatement: studentDocs.bankStatement ?? null,

      /* ------------------ SETA ------------------ */
      seta: agreement?.name ?? "N/A",
      setaName: agreement?.name ?? "N/A",
      agreementReference: agreement?.reference_number ?? null,
      agreementStatus: agreement?.status ?? null,

      /* ------------------ EMPLOYER ------------------ */
      employer: company?.company_name ?? "Not Placed",
      employerName: company?.company_name ?? "Not Placed",
      workplaceAddress: company?.address ?? "Not Available",
      supervisor: placement?.supervisor ?? "Not Assigned",
      supervisorEmail: placement?.email ?? null,
      supervisorPhone: placement?.phone ?? null,

      placementStatus: placement?.status ?? "Not Placed",
      placementStartDate: placement?.start_data,
      placementEndDate: placement?.end_data,
      placementPeriod: placement
        ? `${placement.start_date} → ${placement.end_date}`
        : null,

      /* ------------------ BIOGRAPHICS ------------------ */
      idNumber:
        student.ID_number ??
        student.id_number ??
        null,

      dateOfBirth: bioData.date_of_birth ?? null,
      gender: bioData.gender ?? null,
      physicalAddress: bioData.address ?? null,
      postalAddress: bioData.address ?? null,
      nationality: "South African",

      /* ------------------ SYSTEM ------------------ */
      attendance,
      compliance:
        attendance >= 80
          ? "Compliant"
          : attendance >= 70
          ? "At Risk"
          : "Non-Compliant",

      stipendStatus: allocation?.status ?? "Pending",

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${student.first_name} ${student.last_name}`
      )}&background=0245A3&color=ffffff&size=128`,
    };
  });

};