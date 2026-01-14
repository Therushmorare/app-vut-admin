"use client"

import React, { useState, useRef } from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';

const PayslipModal = ({ student, onClose }) => {
  const printRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [payslipData] = useState({
    payslipNumber: '2025-00123',
    generatedDate: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
    studentName: student?.name || 'Bokamoso Simelane',
    studentNumber: student?.studentNumber || '123456',
    idNumber: student?.idNumber || '9801011234567',
    programme: student?.programme || 'National Diploma in Electrical Engineering',
    setaProgramme: student?.learnerships || 'MICTSETA Learnership',
    fundingType: student?.fundingType || 'Learnership Stipend',
    periodStart: '01 Nov 2025',
    periodEnd: '30 Nov 2025',
    

    baseStipend: 3000.00,
    attendanceBonus: 0.00,
    transportAllowance: 200.00,
    otherAllowances: 0.00,
    
    deductions: 0.00,
    
    paymentMethod: 'Bank Transfer',
    bankName: student?.bankName || 'ABSA Bank',
    accountNumber: student?.accountNumber || '****1234',
    
    workplaceHoursRequired: 160,
    workplaceHoursCompleted: 160,
    trainingSessionsRequired: 20,
    trainingSessionsCompleted: 20,
    
    authorizedBy: 'Programme Administrator',
    authorizedPosition: 'Programme Administrator'
  });

  const grossPay = payslipData.baseStipend + payslipData.attendanceBonus + payslipData.transportAllowance + payslipData.otherAllowances;
  const netPay = grossPay - payslipData.deductions;

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body * {
            visibility: hidden;
          }
          
          #payslip-print-area,
          #payslip-print-area * {
            visibility: visible;
          }
          
          #payslip-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
          {/* Modal Header - No Print */}
          <div className="no-print bg-blue-900 text-white p-4 flex items-center justify-between rounded-t-lg" style={{backgroundColor: '#0245A3'}}>
            <div className="flex items-center gap-3">
              <FileText size={24} />
              <h2 className="text-xl font-bold">Student Payslip</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:opacity-90 font-semibold transition-opacity"
                style={{backgroundColor: '#f8a528', color: '#0245A3'}}
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Payslip Content - Printable */}
          <div id="payslip-print-area" ref={printRef} className="p-8 bg-white">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold mb-1" style={{color: '#0245A3'}}>VAAL UNIVERSITY OF TECHNOLOGY</h1>
              <h2 className="text-xl font-semibold text-gray-700">STUDENT STIPEND PAYSLIP</h2>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Payslip No.:</strong> {payslipData.payslipNumber}</p>
                <p><strong>Generated Date:</strong> {payslipData.generatedDate}</p>
              </div>
            </div>

            {/* Student Information */}
            <div className="mb-4">
              <h3 className="px-3 py-2 font-bold mb-2 text-sm" style={{color: '#0245A3', backgroundColor: 'rgba(248, 165, 40, 0.2)'}}>
                Student Information
              </h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr style={{backgroundColor: '#0245A3'}}>
                    <th className="border border-gray-300 px-3 py-1 text-left text-white">Field</th>
                    <th className="border border-gray-300 px-3 py-1 text-left text-white">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1 font-medium">Name</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.studentName}</td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1 font-medium">Student Number</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.studentNumber}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1 font-medium">ID Number / Passport</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.idNumber}</td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1 font-medium">Programme</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.programme}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1 font-medium">SETA Programme</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.setaProgramme}</td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1 font-medium">Funding Type</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.fundingType}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1 font-medium">Payment Period</td>
                    <td className="border border-gray-300 px-3 py-1">{payslipData.periodStart} – {payslipData.periodEnd}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Earnings / Stipend */}
            <div className="mb-4">
              <h3 className="px-3 py-2 font-bold mb-2 text-sm" style={{color: '#0245A3', backgroundColor: 'rgba(248, 165, 40, 0.2)'}}>
                Earnings / Stipend
              </h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr style={{backgroundColor: '#0245A3'}}>
                    <th className="border border-gray-300 px-3 py-1 text-left text-white">Description</th>
                    <th className="border border-gray-300 px-3 py-1 text-center text-white">Units / Hours</th>
                    <th className="border border-gray-300 px-3 py-1 text-right text-white">Rate (ZAR)</th>
                    <th className="border border-gray-300 px-3 py-1 text-right text-white">Amount (ZAR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1">Base Monthly Stipend</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">1 Month</td>
                    <td className="border border-gray-300 px-3 py-1 text-right">{payslipData.baseStipend.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-semibold">{payslipData.baseStipend.toFixed(2)}</td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1">Attendance Bonus</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">100%</td>
                    <td className="border border-gray-300 px-3 py-1 text-right">{payslipData.attendanceBonus.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-semibold">{payslipData.attendanceBonus.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1">Transport Allowance</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">Flat Rate</td>
                    <td className="border border-gray-300 px-3 py-1 text-right">{payslipData.transportAllowance.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-semibold">{payslipData.transportAllowance.toFixed(2)}</td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1">Other Allowances</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">N/A</td>
                    <td className="border border-gray-300 px-3 py-1 text-right">{payslipData.otherAllowances.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-semibold">{payslipData.otherAllowances.toFixed(2)}</td>
                  </tr>
                  <tr style={{backgroundColor: 'rgba(2, 69, 163, 0.1)'}}>
                    <td colSpan="3" className="border border-gray-300 px-3 py-1 text-right font-bold">Gross Pay</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-bold">{grossPay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div className="mb-4">
              <h3 className="px-3 py-2 font-bold mb-2 text-sm" style={{color: '#0245A3', backgroundColor: 'rgba(248, 165, 40, 0.2)'}}>
                Deductions
              </h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr style={{backgroundColor: '#0245A3'}}>
                    <th className="border border-gray-300 px-3 py-1 text-left text-white">Description</th>
                    <th className="border border-gray-300 px-3 py-1 text-right text-white">Amount (ZAR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1">None / N/A</td>
                    <td className="border border-gray-300 px-3 py-1 text-right">{payslipData.deductions.toFixed(2)}</td>
                  </tr>
                  <tr style={{backgroundColor: 'rgba(2, 69, 163, 0.1)'}}>
                    <td className="border border-gray-300 px-3 py-1 font-bold">Total Deductions</td>
                    <td className="border border-gray-300 px-3 py-1 text-right font-bold">{payslipData.deductions.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Pay */}
            <div className="rounded-lg p-4 mb-4" style={{backgroundColor: 'rgba(2, 69, 163, 0.05)', border: '2px solid #0245A3'}}>
              <h3 className="text-xl font-bold mb-2" style={{color: '#0245A3'}}>Net Pay</h3>
              <p className="text-2xl font-bold mb-2" style={{color: '#0245A3'}}>ZAR {netPay.toFixed(2)}</p>
              <div className="text-left text-xs space-y-1">
                <p><strong>Payment Method:</strong> {payslipData.paymentMethod}</p>
                <p><strong>Bank:</strong> {payslipData.bankName}</p>
                <p><strong>Account Number:</strong> {payslipData.accountNumber}</p>
              </div>
            </div>

            {/* Attendance / Hours Verification */}
            <div className="mb-4">
              <h3 className="px-3 py-2 font-bold mb-2 text-sm" style={{color: '#0245A3', backgroundColor: 'rgba(248, 165, 40, 0.2)'}}>
                Attendance / Hours Verification
              </h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr style={{backgroundColor: '#0245A3'}}>
                    <th className="border border-gray-300 px-3 py-1 text-left text-white">Component</th>
                    <th className="border border-gray-300 px-3 py-1 text-center text-white">Required</th>
                    <th className="border border-gray-300 px-3 py-1 text-center text-white">Completed</th>
                    <th className="border border-gray-300 px-3 py-1 text-center text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-1">Workplace Hours / WIL</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{payslipData.workplaceHoursRequired}h</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{payslipData.workplaceHoursCompleted}h</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold" style={{backgroundColor: '#dcfce7', color: '#15803d'}}>
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <td className="border border-gray-300 px-3 py-1">Training Attendance</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{payslipData.trainingSessionsRequired}</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{payslipData.trainingSessionsCompleted}</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold" style={{backgroundColor: '#dcfce7', color: '#15803d'}}>
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Authorization */}
            <div className="mt-6 pt-4 border-t-2 border-gray-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="mb-1 text-xs text-gray-600">Authorized by:</p>
                  <p className="font-semibold text-sm">{payslipData.authorizedBy}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-600">Position:</p>
                  <p className="font-semibold text-sm">{payslipData.authorizedPosition}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-600"><strong>Date:</strong> {payslipData.generatedDate}</p>
            </div>

            {/* Footer Note */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 text-center">
              <p className="font-semibold">This is a computer-generated document and does not require a signature.</p>
              <p>For queries, please contact the Programme Administration Office.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayslipModal;