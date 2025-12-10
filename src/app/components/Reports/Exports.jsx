"use client"
import React, { useState } from 'react';
import { Download, FileText, Archive, CheckCircle, Users, Building2, FileSpreadsheet } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function ExportManager({
  companies = [],
  placements = [],
  allocatedLearners = [],
  agreements = [],
  fundingWindows = [],
  filters = {},
  onExport
}) {
  const [exportType, setExportType] = useState('registration');
  const [exporting, setExporting] = useState(false);

  const getFilteredLearners = (statusFilter = null) => {
    let results = [...allocatedLearners];

    if (filters.faculty) results = results.filter(l => l.faculty === filters.faculty);
    if (filters.seta) results = results.filter(l => l.agreementId === filters.seta);
    if (filters.programme) results = results.filter(l => l.programme === filters.programme);
    if (filters.fundingWindow) results = results.filter(l => l.fundingWindowId === filters.fundingWindow);

    if (statusFilter) {
      const placedLearnerIds = placements.map(p => p.learnerId);
      if (statusFilter === 'registered') {
        return results;
      } else if (statusFilter === 'unplaced') {
        results = results.filter(l => !placedLearnerIds.includes(l.id));
      } else {
        results = results.filter(l => {
          const placement = placements.find(p => p.learnerId === l.id);
          return placement && placement.status === statusFilter;
        });
      }
    }

    if (filters.hostCompany) {
      const companyPlacements = placements.filter(p => p.companyId === filters.hostCompany);
      const learnerIds = companyPlacements.map(p => p.learnerId);
      results = results.filter(l => learnerIds.includes(l.id));
    }

    if (filters.year) {
      results = results.filter(l => {
        const placement = placements.find(p => p.learnerId === l.id);
        if (!placement) return false;
        const year = new Date(placement.startDate).getFullYear();
        return year.toString() === filters.year;
      });
    }

    return results;
  };

  const generateCSV = (data, headers) => {
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      csvRows.push(row.map(field => {

        const escaped = String(field).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','));
    });
    return csvRows.join('\n');
  };
//download csv
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };


  const exportRegistration = () => {
    const learners = getFilteredLearners('registered');
    const headers = ['Student ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Faculty', 'Programme', 'SETA', 'Funding Window', 'Allocated Date'];
    
    const rows = learners.map(l => {
      const agreement = agreements.find(a => a.id === l.agreementId);
      const window = fundingWindows.find(w => w.id === l.fundingWindowId);
      return [
        l.studentId || '',
        l.firstName || '',
        l.lastName || '',
        l.email || '',
        l.phone || '',
        l.faculty || '',
        l.programme || '',
        agreement?.setaName || '',
        window?.windowName || '',
        l.allocatedDate || ''
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `registration-list-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported ${learners.length} registered learners`, 'success');
  };

  const exportActive = () => {
    const learners = getFilteredLearners('Active');
    const headers = ['Student ID', 'Name', 'Email', 'Faculty', 'Programme', 'SETA', 'Host Company', 'Supervisor', 'Start Date', 'End Date', 'Status'];
    
    const rows = learners.map(l => {
      const placement = placements.find(p => p.learnerId === l.id);
      const company = placement ? companies.find(c => c.id === placement.companyId) : null;
      const agreement = agreements.find(a => a.id === l.agreementId);
      
      return [
        l.studentId || '',
        `${l.firstName} ${l.lastName}`,
        l.email || '',
        l.faculty || '',
        l.programme || '',
        agreement?.setaName || '',
        company?.companyName || '',
        placement?.supervisorName || '',
        placement?.startDate || '',
        placement?.endDate || '',
        placement?.status || ''
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `active-learners-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported ${learners.length} active learners`, 'success');
  };

  const exportCompleted = () => {
    const learners = getFilteredLearners('Completed');
    const headers = ['Student ID', 'Name', 'Email', 'Faculty', 'Programme', 'SETA', 'Host Company', 'Start Date', 'End Date', 'Completion Date', 'Duration (months)'];
    
    const rows = learners.map(l => {
      const placement = placements.find(p => p.learnerId === l.id);
      const company = placement ? companies.find(c => c.id === placement.companyId) : null;
      const agreement = agreements.find(a => a.id === l.agreementId);
      
      let duration = '';
      if (placement?.startDate && placement?.endDate) {
        const start = new Date(placement.startDate);
        const end = new Date(placement.endDate);
        duration = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
      }
      
      return [
        l.studentId || '',
        `${l.firstName} ${l.lastName}`,
        l.email || '',
        l.faculty || '',
        l.programme || '',
        agreement?.setaName || '',
        company?.companyName || '',
        placement?.startDate || '',
        placement?.endDate || '',
        placement?.endDate || '',
        duration
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `completed-learners-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported ${learners.length} completed learners`, 'success');
  };

  const exportTerminated = () => {
    const learners = getFilteredLearners('Terminated');
    const headers = ['Student ID', 'Name', 'Email', 'Faculty', 'Programme', 'SETA', 'Host Company', 'Start Date', 'Termination Date', 'Reason'];
    
    const rows = learners.map(l => {
      const placement = placements.find(p => p.learnerId === l.id);
      const company = placement ? companies.find(c => c.id === placement.companyId) : null;
      const agreement = agreements.find(a => a.id === l.agreementId);
      
      return [
        l.studentId || '',
        `${l.firstName} ${l.lastName}`,
        l.email || '',
        l.faculty || '',
        l.programme || '',
        agreement?.setaName || '',
        company?.companyName || '',
        placement?.startDate || '',
        placement?.endDate || '',
        placement?.notes || ''
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `terminated-learners-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported ${learners.length} terminated learners`, 'success');
  };
//comprehensive audit export
  const exportAudit = () => {
    const learners = getFilteredLearners();
    const headers = [
      'Student ID', 'First Name', 'Last Name', 'ID Number', 'Email', 'Phone',
      'Faculty', 'Programme', 'SETA', 'Agreement Reference', 'Funding Window',
      'Placement Status', 'Host Company', 'Company Registration', 'Supervisor Name', 
      'Supervisor Email', 'Start Date', 'End Date', 'Allocated Date'
    ];
    
    const rows = learners.map(l => {
      const placement = placements.find(p => p.learnerId === l.id);
      const company = placement ? companies.find(c => c.id === placement.companyId) : null;
      const agreement = agreements.find(a => a.id === l.agreementId);
      const window = fundingWindows.find(w => w.id === l.fundingWindowId);
      
      return [
        l.studentId || '',
        l.firstName || '',
        l.lastName || '',
        l.idNumber || '',
        l.email || '',
        l.phone || '',
        l.faculty || '',
        l.programme || '',
        agreement?.setaName || '',
        agreement?.agreementRef || '',
        window?.windowName || '',
        placement?.status || 'Unplaced',
        company?.companyName || '',
        company?.registrationNumber || '',
        placement?.supervisorName || '',
        placement?.supervisorEmail || '',
        placement?.startDate || '',
        placement?.endDate || '',
        l.allocatedDate || ''
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `audit-report-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported comprehensive audit report for ${learners.length} learners`, 'success');
  };

//companies report
  const exportCompanies = () => {
    const headers = [
      'Company Name', 'Registration Number', 'Industry Sector', 'SETA',
      'Contact Person', 'Email', 'Phone', 'Address', 'Capacity',
      'Active Placements', 'Total Placements', 'MoU Status'
    ];
    
    let filteredCompanies = [...companies];
    if (filters.seta) {
      filteredCompanies = filteredCompanies.filter(c => c.agreementId === filters.seta);
    }
    
    const rows = filteredCompanies.map(c => {
      const companyPlacements = placements.filter(p => p.companyId === c.id);
      const activePlacements = companyPlacements.filter(p => p.status === 'Active').length;
      const agreement = agreements.find(a => a.id === c.agreementId);
      
      return [
        c.companyName || '',
        c.registrationNumber || '',
        c.industrySector || '',
        agreement?.setaName || '',
        c.contactPerson || '',
        c.contactEmail || '',
        c.contactPhone || '',
        c.address || '',
        c.learnerCapacity || '',
        activePlacements,
        companyPlacements.length,
        c.mouStatus || ''
      ];
    });

    const csv = generateCSV(rows, headers);
    downloadCSV(csv, `companies-report-${new Date().toISOString().split('T')[0]}.csv`);
    onExport(`Exported ${filteredCompanies.length} companies`, 'success');
  };

  const handleExport = async () => {
    setExporting(true);
    
    try {
      switch (exportType) {
        case 'registration':
          exportRegistration();
          break;
        case 'active':
          exportActive();
          break;
        case 'completed':
          exportCompleted();
          break;
        case 'terminated':
          exportTerminated();
          break;
        case 'audit':
          exportAudit();
          break;
        case 'companies':
          exportCompanies();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      onExport('Export failed. Please try again.', 'error');
    }
    
    setTimeout(() => setExporting(false), 1000);
  };

  const exportOptions = [
    {
      id: 'registration',
      name: 'Registration List',
      description: 'All allocated learners with basic information',
      icon: FileText,
      color: COLORS.primary,
      count: getFilteredLearners('registered').length
    },
    {
      id: 'active',
      name: 'Active Learners',
      description: 'Currently active placements with host companies',
      icon: Users,
      color: COLORS.success,
      count: getFilteredLearners('Active').length
    },
    {
      id: 'completed',
      name: 'Completed Learners',
      description: 'Successfully completed placements',
      icon: CheckCircle,
      color: COLORS.info,
      count: getFilteredLearners('Completed').length
    },
    {
      id: 'terminated',
      name: 'Terminated Learners',
      description: 'Terminated placements with reasons',
      icon: FileText,
      color: COLORS.danger,
      count: getFilteredLearners('Terminated').length
    },
    {
      id: 'audit',
      name: 'Comprehensive Audit Report',
      description: 'Complete data export for compliance and auditing',
      icon: FileSpreadsheet,
      color: COLORS.secondary,
      count: getFilteredLearners().length
    },
    {
      id: 'companies',
      name: 'Host Companies Report',
      description: 'All host companies with placement statistics',
      icon: Building2,
      color: COLORS.warning,
      count: companies.length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map(option => {
          const Icon = option.icon;
          const isSelected = exportType === option.id;
          
          return (
            <div
              key={option.id}
              onClick={() => setExportType(option.id)}
              className={`rounded-lg p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-blue-500 shadow-md' : 'border-transparent'
              }`}
              style={{ 
                backgroundColor: COLORS.bgWhite,
                borderColor: isSelected ? option.color : COLORS.border
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${option.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: option.color }} />
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5" style={{ color: option.color }} />
                )}
              </div>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>
                {option.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {option.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold" style={{ color: option.color }}>
                  {option.count}
                </span>
                <span className="text-xs text-gray-500">records</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).some(v => v !== '') && (
        <div className="rounded-lg p-4 border" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: COLORS.primary }}>
            Active Filters Applied:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span key={key} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {key}: {value}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-3 px-8 py-4 rounded-lg text-white text-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          style={{ backgroundColor: COLORS.success }}
        >
          {exporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>Export to Excel</span>
            </>
          )}
        </button>
      </div>

      {/* Export Info */}
      <div className="rounded-lg p-6 border" style={{ backgroundColor: COLORS.bgLight, borderColor: COLORS.border }}>
        <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
          📊 Export Information
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Exports are generated in CSV format compatible with Excel</li>
          <li>• All data is filtered based on your current filter selections</li>
          <li>• Files are named with the current date for easy reference</li>
          <li>• Sensitive information is included - handle files securely</li>
          <li>• For document packs, contact IT support for ZIP archive generation</li>
        </ul>
      </div>
    </div>
  );
}