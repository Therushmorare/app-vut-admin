import { useState } from 'react';

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
      budgetAllocation: '',
      requiredDocs: '',
      timesheetTemplate: null,
      notes: ''
    }]
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.windowName) newErrors.windowName = 'Window name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.numLearners || formData.numLearners <= 0) newErrors.numLearners = 'Valid number required';
    if (!formData.slotsAvailable || formData.slotsAvailable <= 0) newErrors.slotsAvailable = 'Valid slots required';
    if (!formData.budgetAllocation || formData.budgetAllocation <= 0) newErrors.budgetAllocation = 'Valid budget required';
    
    formData.programmes.forEach((prog, index) => {
      if (!prog.programmeName) newErrors[`programme_${index}_name`] = 'Programme name required';
      if (!prog.budgetAllocation || prog.budgetAllocation <= 0) {
        newErrors[`programme_${index}_budget`] = 'Valid budget required';
      }
    });

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileChange = (programmeId, file) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, timesheetTemplate: file } : p
      )
    }));
  };

  const removeFile = (programmeId) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, timesheetTemplate: null } : p
      )
    }));
  };

  const addProgramme = () => {
    const newProgramme = {
      id: Date.now(),
      programmeName: '',
      programmeDuration: '',
      budgetAllocation: '',
      requiredDocs: '',
      timesheetTemplate: null,
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      programmes: [...prev.programmes, newProgramme]
    }));
  };

  const removeProgramme = (programmeId) => {
    if (formData.programmes.length === 1) return;
    
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.filter(p => p.id !== programmeId)
    }));
  };

  const handleProgrammeChange = (programmeId, field, value) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, [field]: value } : p
      )
    }));
    
    const errorKey = `programme_${formData.programmes.findIndex(p => p.id === programmeId)}_${field === 'programmeName' ? 'name' : 'budget'}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const getTotalProgrammeBudget = () => {
    return formData.programmes.reduce((sum, prog) => {
      return sum + (parseFloat(prog.budgetAllocation) || 0);
    }, 0);
  };

  const handleSubmit = (onSubmit) => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleFileChange,
    removeFile,
    addProgramme,
    removeProgramme,
    handleProgrammeChange,
    getTotalProgrammeBudget,
    handleSubmit
  };
}