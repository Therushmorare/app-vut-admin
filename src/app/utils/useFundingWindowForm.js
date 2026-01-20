import { useState, useEffect } from 'react';

export default function useFundingWindowForm(initialWindow, agreementId) {
  const [formData, setFormData] = useState({
    agreementId: agreementId || initialWindow?.agreementId || '',
    windowName: initialWindow?.windowName || '',
    startDate: initialWindow?.startDate || '',
    endDate: initialWindow?.endDate || '',
    numLearners: initialWindow?.numLearners || '',
    financialYear: initialWindow?.financialYear || '',
    slotsAvailable: initialWindow?.slotsAvailable || '',
    budgetAllocation: initialWindow?.budgetAllocation || '',
    programmes: initialWindow?.programmes || [{
      id: Date.now(),
      programmeName: '',
      programmeDuration: '',
      requiredNumStudents: '',
      budgetAllocation: '',
      requiredDocs: [],
      notes: '',
      timesheetTemplate: null
    }]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Keep agreementId in sync if parent changes it
  useEffect(() => {
    if (agreementId) setFormData(prev => ({ ...prev, agreementId }));
  }, [agreementId]);

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors = {};

    if (!formData.windowName) newErrors.windowName = 'Window name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.numLearners || formData.numLearners <= 0)
      newErrors.numLearners = 'Valid number required';
    if (!formData.slotsAvailable || formData.slotsAvailable <= 0)
      newErrors.slotsAvailable = 'Valid slots required';
    if (!formData.budgetAllocation || formData.budgetAllocation <= 0)
      newErrors.budgetAllocation = 'Valid budget required';

    formData.programmes.forEach((p, i) => {
      if (!p.programmeName) newErrors[`programme_${i}_name`] = 'Programme name required';
      if (!p.budgetAllocation || p.budgetAllocation <= 0)
        newErrors[`programme_${i}_budget`] = 'Valid budget required';
    });

    return newErrors;
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleProgrammeChange = (programmeId, field, value) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, [field]: value } : p
      )
    }));
  };

  const addProgramme = () => {
    setFormData(prev => ({
      ...prev,
      programmes: [...prev.programmes, {
        id: Date.now(),
        programmeName: '',
        programmeDuration: '',
        requiredNumStudents: '',
        budgetAllocation: '',
        requiredDocs: [],
        notes: '',
        timesheetTemplate: null
      }]
    }));
  };

  const removeProgramme = (programmeId) => {
    if (formData.programmes.length === 1) return;
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.filter(p => p.id !== programmeId)
    }));
  };

  const getTotalProgrammeBudget = () =>
    formData.programmes.reduce((sum, p) => sum + (+p.budgetAllocation || 0), 0);

  /* ---------- API SUBMIT ---------- */
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const adminId = sessionStorage.getItem("admin_id");
    if (!adminId) {
      setSubmitError("Admin session expired. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1️⃣ CREATE FUNDING WINDOW
      const payload = {
        administrator_id: adminId,
        agreement_id: String(formData.agreementId),
        funding_window_name: formData.windowName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        num_of_learners: Number(formData.numLearners),
        financial_year: formData.financialYear,
        slots_available: Number(formData.slotsAvailable),
        budget_allocation: Number(formData.budgetAllocation)
      };

      console.log("Funding window payload:", payload);

      const fwRes = await fetch(
        `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/funding-windows`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        }
      );

      const fwData = await fwRes.json();

      if (!fwRes.ok) {
        throw new Error(fwData.message || "Failed to create funding window");
      }

      const fundingWindowId = fwData.funding_window_id;

      // 2️⃣ CREATE PROGRAMMES
      for (const prog of formData.programmes) {
        const documentsArr =
          typeof prog.requiredDocs === "string"
            ? prog.requiredDocs.split("\n").map(d => d.trim()).filter(Boolean)
            : prog.requiredDocs || [];

        const duration =
          prog.programmeDuration
            ? `${prog.programmeDuration} months` // <-- ensure backend-friendly string
            : "0 months";

        const payload = {
          administrator_id: adminId,
          agreement_id: String(formData.agreementId),
          funding_window_id: fundingWindowId,
          programme_name: prog.programmeName.trim(),
          duration: duration,
          required_num_students: Number(prog.requiredNumStudents || 0),
          programme_budget: Number(prog.budgetAllocation || 0),
          documents_arr: documentsArr,
          notes: prog.notes?.trim() || ""
        };

        const progRes = await fetch(
          "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/programmes",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
          }
        );

        const progData = await progRes.json();
        if (!progRes.ok) {
          console.error("Programme payload failed:", payload, progData);
          throw new Error(progData.message || `Failed to create programme: ${prog.programmeName}`);
        }
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error("Funding window submission failed:", err);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleProgrammeChange,
    addProgramme,
    removeProgramme,
    getTotalProgrammeBudget,
    handleSubmit
  };
}