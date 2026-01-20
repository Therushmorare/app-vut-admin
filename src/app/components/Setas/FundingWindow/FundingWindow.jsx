"use client"
import React from 'react';
import BasicInfoFields from './BasicInfoFields';
import ProgrammesSection from './ProgrammeSection';
import FormActions from './FormActions';
import useFundingWindowForm from '../../../utils/useFundingWindowForm';

const FundingWindowForm = ({ window, agreementId, onSubmit, onCancel }) => {
  const {
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
  } = useFundingWindowForm(window, agreementId);

  return (
    <div className="space-y-6">
      <BasicInfoFields
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />

      <ProgrammesSection
        programmes={formData.programmes}
        errors={errors}
        windowBudget={formData.budgetAllocation}
        onAddProgramme={addProgramme}
        onRemoveProgramme={removeProgramme}
        onProgrammeChange={handleProgrammeChange}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        getTotalBudget={getTotalProgrammeBudget}
      />

      <FormActions
        isEditMode={!!window}
        onCancel={onCancel}
        onSubmit={() =>
          handleSubmit((result) => {
            if (result.success) alert("Funding window created successfully!");
            else alert(`Error: ${result.error}`);
          })
        }
      />
      
    </div>
  );
};

export default FundingWindowForm;