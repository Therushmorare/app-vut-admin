import { useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    if (agreementId) {
      setFormData(prev => ({ ...prev, agreementId }));
    }
  }, [agreementId]);

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const errs = {};

    if (!formData.windowName) errs.windowName = 'Window name is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.endDate) errs.endDate = 'End date is required';
    if (+formData.numLearners <= 0) errs.numLearners = 'Invalid learners';
    if (+formData.slotsAvailable <= 0) errs.slotsAvailable = 'Invalid slots';
    if (+formData.budgetAllocation <= 0) errs.budgetAllocation = 'Invalid budget';

    formData.programmes.forEach((p, i) => {
      if (!p.programmeName) errs[`programme_${i}_name`] = 'Programme name required';
      if (+p.budgetAllocation <= 0) errs[`programme_${i}_budget`] = 'Invalid budget';
    });

    return errs;
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProgrammeChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === id ? { ...p, [field]: value } : p
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

  // ✅ FIXED: no stale closure
  const removeProgramme = id => {
    setFormData(prev => {
      if (prev.programmes.length === 1) return prev;
      return {
        ...prev,
        programmes: prev.programmes.filter(p => p.id !== id)
      };
    });
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = useCallback(async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const adminId = sessionStorage.getItem("admin_id");
    if (!adminId) {
      setSubmitError("Session expired");
      setIsSubmitting(false);
      return;
    }

    try {
      const fwPayload = {
        administrator_id: adminId,
        agreement_id: String(formData.agreementId),
        funding_window_name: formData.windowName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        num_of_learners: +formData.numLearners,
        financial_year: formData.financialYear,
        slots_available: +formData.slotsAvailable,
        budget_allocation: +formData.budgetAllocation
      };

      const fwRes = await fetch(
        "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/funding-windows",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(fwPayload)
        }
      );

      const fwData = await fwRes.json();
      if (!fwRes.ok) {
        throw new Error(fwData?.message || "Failed to create funding window");
      }

      const fundingWindowId =
        fwData?.funding_window_id ||
        fwData?.id ||
        fwData?.funding_window?.id;

      if (!fundingWindowId) {
        throw new Error("Funding window ID missing from response");
      }

      for (const prog of formData.programmes) {
        const fd = new FormData();
        fd.append("administrator_id", adminId);
        fd.append("agreement_id", String(formData.agreementId));
        fd.append("funding_window_id", fundingWindowId);
        fd.append("programme_name", prog.programmeName.trim());
        fd.append("duration", prog.programmeDuration || "0 months");
        fd.append("required_num_students", +prog.requiredNumStudents || 0);
        fd.append("programme_budget", +prog.budgetAllocation || 0);
        fd.append("notes", prog.notes || "");

        (Array.isArray(prog.requiredDocs) ? prog.requiredDocs : [])
          .forEach(doc => fd.append("documents_arr", doc));

        if (prog.timesheetTemplate) {
          fd.append("time_sheet_template", prog.timesheetTemplate);
        }

        const progRes = await fetch(
          "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/programmes",
          {
            method: "POST",
            credentials: "include",
            body: fd
          }
        );

        const progData = await progRes.json();
        if (!progRes.ok) {
          throw new Error(progData?.message || "Failed to create programme");
        }
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

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
    handleSubmit
  };
}