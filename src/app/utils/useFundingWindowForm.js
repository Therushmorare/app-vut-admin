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

  /* keep agreementId in sync */
  useEffect(() => {
    if (agreementId) {
      setFormData(prev => ({ ...prev, agreementId }));
    }
  }, [agreementId]);

  /* ---------- validation ---------- */
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

  /* ---------- handlers ---------- */
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

    const adminId = sessionStorage.getItem("admin_id");
    if (!adminId) {
      alert("Admin session expired. Please log in again.");
      return;
    }

    try {
      /* 1️⃣ CREATE FUNDING WINDOW */
      const fwRes = await fetch(
        `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/funding-windows`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            administrator_id: adminId,
            agreement_id: formData.agreementId,
            funding_window_name: formData.windowName,
            start_date: formData.startDate,
            end_date: formData.endDate,
            num_of_learners: Number(formData.numLearners),
            financial_year: formData.financialYear,
            slots_available: Number(formData.slotsAvailable),
            budget_allocation: Number(formData.budgetAllocation)
          })
        }
      );

      if (!fwRes.ok) throw new Error('Failed to create funding window');

      const fwData = await fwRes.json();
      const fundingWindowId = fwData.id;

      /* 2️⃣ CREATE PROGRAMMES */
      for (const prog of formData.programmes) {
        await fetch(
          `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/programmes`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              administrator_id: adminId,
              agreement_id: formData.agreementId,
              funding_window_id: fundingWindowId,
              programme_name: prog.programmeName,
              duration: prog.programmeDuration,
              required_num_students: Number(prog.requiredNumStudents || 0),
              programme_budget: Number(prog.budgetAllocation),
              documents_arr: prog.requiredDocs,
              notes: prog.notes
            })
          }
        );
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
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