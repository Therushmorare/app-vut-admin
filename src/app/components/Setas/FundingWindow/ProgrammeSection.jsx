import React from 'react';
import { COLORS } from '../../../utils/helpers';
import ProgrammeItem from './ProgrammeItem';
import BudgetSummary from './BudgetSummary';

export default function ProgrammesSection({ 
  programmes,
  errors,
  windowBudget,
  onAddProgramme,
  onRemoveProgramme,
  onProgrammeChange,
  onFileChange,
  onRemoveFile,
  getTotalBudget
}) {
  return (
    <div className="border-t pt-6" style={{ borderColor: COLORS.border }}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
          Programme Details
        </h3>
        <button
          type="button"
          onClick={onAddProgramme}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          + Add Programme
        </button>
      </div>

      {/* Programme Items */}
      {programmes.map((programme, index) => (
        <ProgrammeItem
          key={programme.id}
          programme={programme}
          index={index}
          errors={errors}
          canRemove={programmes.length > 1}
          onChange={(field, value) => onProgrammeChange(programme.id, field, value)}
          onRemove={() => onRemoveProgramme(programme.id)}
          onFileChange={(file) => onFileChange(programme.id, file)}
          onRemoveFile={() => onRemoveFile(programme.id)}
        />
      ))}

      {/* Budget Summary */}
      {programmes.length > 0 && (
        <BudgetSummary
          totalProgrammeBudget={getTotalBudget()}
          windowBudget={windowBudget}
        />
      )}
    </div>
  );
}
