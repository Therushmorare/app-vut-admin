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

// Fetch stipend budget for a programme
const getStipendBudget = async (programme_id) => {
  if (!programme_id) return null;
  try {
    const res = await api.get(`/api/administrators/stipend-budget/${programme_id}`);
    return res.data ?? null;
  } catch (err) {
    console.error(`Stipend API failed for programme_id: ${programme_id}`, err.message);
    return null;
  }
};

/**
 * Fetch students data safely with stipend integration
 */
export const generateStudents = async () => {
  if (!API_BASE) {
    console.warn("API_BASE is undefined");
    return [];
  }

  // Fetch all required data
  const [
    studentsData,
    biographicsData,
    setasData,
    companiesData,
    bankingData,
    documentsData,
    allocationsData,
    agreementsData,
    placementsData,
  ] = await Promise.all([
    safeGet("/api/administrators/students"),
    safeGet("/api/administrators/biographics"),
    safeGet("/api/administrators/setas"),
    safeGet("/api/administrators/host-companies"),
    safeGet("/api/administrators/bankingDetails"),
    safeGet("/api/administrators/studentDocuments"),
    safeGet("/api/administrators/learner-allocations"),
    safeGet("/api/administrators/setaAgreements"),
    safeGet("/api/administrators/learner-placements"),
  ]);

  const students = studentsData.students ?? [];
  const biographics = biographicsData.biographics ?? [];
  const setas = setasData.setas ?? [];
  const companies = companiesData.companies ?? [];
  const banking = Array.isArray(bankingData) ? bankingData : [];
  const docs = Array.isArray(documentsData) ? documentsData : [];
  const allocations = allocationsData.allocations ?? [];
  const agreements = Array.isArray(agreementsData) ? agreementsData : [];
  const placements = placementsData.placements ?? [];

  // Index maps
  const bioMap = Object.fromEntries(biographics.map((b) => [b.user_id, b]));
  const setaMap = Object.fromEntries(setas.map((s) => [s.id, s]));
  const companyMap = Object.fromEntries(companies.map((c) => [c.company_id, c]));
  const bankMap = Object.fromEntries(banking.map((b) => [b.student_id || b.user_id, b]));
  const allocationMap = Object.fromEntries(allocations.map((a) => [a.student_id, a]));
  const agreementMap = Object.fromEntries(agreements.map((a) => [a.agreement_id, a]));
  const placementMap = Object.fromEntries(placements.map((p) => [p.student_id, p]));

  // Documents grouped per user
  const docMap = {};
  docs.forEach((d) => {
    const key = DOC_TYPE_MAP[d.doc_type];
    if (!key) return;
    if (!docMap[d.user_id]) docMap[d.user_id] = {};
    docMap[d.user_id][key] = {
      status: "Uploaded",
      url: d.document,
      documentId: d.document_id,
    };
  });

  // Fetch stipend budgets per unique programme (optimization)
  const uniqueProgrammeIds = [...new Set(allocations.map(a => a.programme_id).filter(Boolean))];
  const stipendMap = {};
  await Promise.all(
    uniqueProgrammeIds.map(async (pid) => {
      stipendMap[pid] = await getStipendBudget(pid);
    })
  );

  // Normalize students
  return students.map((student) => {
    const bioData = bioMap[student.id] || {};
    const bank = bankMap[student.id] || {};
    const studentDocs = docMap[student.id] || {};
    const allocation = allocationMap[student.id] || null;
    const agreement = allocation ? agreementMap[allocation.agreement_id] : null;
    const placement = placementMap[student.id] || null;
    const company = placement ? companyMap[placement.company_id] : null;
    const stipend = allocation ? stipendMap[allocation.programme_id] : null;

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
      faculty: student?.faculty ?? "N/A",
      status: student.status,

      /* ------------------ BANKING ------------------ */
      bankName: bank.bank_name ?? null,
      accountNumber: bank.account_number ?? null,

      /* ------------------ DOCUMENTS ------------------ */
      learnerAgreement: agreement ? "Uploaded - Active" : "Not Allocated",
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
      programmeID: allocation?.programme_id ?? null,
      programmeStatus: allocation?.status ?? null,

      /* ------------------ EMPLOYER ------------------ */
      employer: company?.company_name ?? "Not Placed",
      employerName: company?.company_name ?? "Not Placed",
      workplaceAddress: company?.address ?? "Not Available",
      supervisor: placement?.supervisor ?? "Not Assigned",
      supervisorEmail: placement?.email ?? null,
      supervisorPhone: placement?.phone ?? null,
      placementStatus: placement?.status ?? "Not Placed",
      placementStartDate: placement?.start_date,
      placementEndDate: placement?.end_date,
      placementPeriod: placement
        ? `${placement.start_date} → ${placement.end_date}`
        : null,

      /* ------------------ BIOGRAPHICS ------------------ */
      idNumber: student.ID_number ?? student.id_number ?? null,
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
      yearlyStipend: stipend?.yearly_stipend_per_student ?? null,
      monthlyStipend: stipend?.monthly_stipend_per_student ?? null,

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${student.first_name} ${student.last_name}`
      )}&background=0245A3&color=ffffff&size=128`,
    };
  });
};