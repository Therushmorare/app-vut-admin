import React from 'react';
import { COLORS } from '../../../utils/helpers';

export default function BudgetSummary({ 
  totalProgrammeBudget, 
  windowBudget 
}) {
  const isOverBudget = windowBudget && totalProgrammeBudget > parseFloat(windowBudget);

  return (
    <div
      className="mt-4 p-4 rounded-lg"
      style={{ backgroundColor: '#f0f9ff', borderLeft: `4px solid ${COLORS.primary}` }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium" style={{ color: COLORS.primary }}>
          Total Programme Budget:
        </span>
        <span className="text-lg font-bold" style={{ color: COLORS.primary }}>
          R {totalProgrammeBudget.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      </div>
      {isOverBudget && (
        <p className="text-sm mt-2" style={{ color: COLORS.danger }}>
          ⚠️ Programme budgets exceed total funding window budget
        </p>
      )}
    </div>
  );
}