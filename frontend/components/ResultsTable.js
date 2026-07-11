'use client';

import { useState } from 'react';
import { Download, CheckCircle, XCircle } from 'lucide-react';

export default function ResultsTable({ results, onExport }) {
  const [filter, setFilter] = useState('all');

  const filteredResults = {
    all: [...results.success, ...results.skipped],
    success: results.success,
    skipped: results.skipped
  };

  const displayData = filteredResults[filter] || [];

  const handleExport = () => {
    if (onExport) onExport();
  };

  const downloadCSV = () => {
    const headers = Object.keys(results.success[0] || {}).join(',');
    const rows = results.success.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val || ''
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(results.success, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_leads.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!results || (results.success.length === 0 && results.skipped.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Imported</span>
          </div>
          <p className="text-2xl font-bold">{results.totalImported}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Skipped</span>
          </div>
          <p className="text-2xl font-bold">{results.totalSkipped}</p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm font-medium block mb-2">Total Records</span>
          <p className="text-2xl font-bold">
            {results.totalImported + results.totalSkipped}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm font-medium block mb-2">Success Rate</span>
          <p className="text-2xl font-bold">
            {results.totalImported + results.totalSkipped > 0
              ? Math.round((results.totalImported / (results.totalImported + results.totalSkipped)) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Filter and Export */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All ({displayData.length})
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'success'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Imported ({results.success.length})
          </button>
          <button
            onClick={() => setFilter('skipped')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'skipped'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Skipped ({results.skipped.length})
          </button>
        </div>
        
        {results.success.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* Processing Notes */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">Processing Notes:</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Successfully imported records: {results.success.length}</li>
          <li>Skipped records: {results.skipped.length}</li>
          {results.skipped.length > 0 && (
            <li>Common skip reasons: No email or mobile number found</li>
          )}
        </ul>
      </div>

      {/* Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {filter === 'skipped' ? (
                    <>
                      <th className="px-4 py-3 text-left font-medium border-b">Row #</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Reason</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Original Data</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left font-medium border-b">Name</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Email</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Mobile</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Company</th>
                      <th className="px-4 py-3 text-left font-medium border-b">City</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Status</th>
                      <th className="px-4 py-3 text-left font-medium border-b">Notes</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayData.length === 0 ? (
                  <tr>
                    <td colSpan={filter === 'skipped' ? 3 : 7} className="px-4 py-8 text-center text-muted-foreground">
                      No records to display
                    </td>
                  </tr>
                ) : (
                  displayData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      {filter === 'skipped' ? (
                        <>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.rowIndex + 1}
                          </td>
                          <td className="px-4 py-3 text-destructive">
                            {item.reason}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                            {JSON.stringify(item.originalData)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{item.name || '-'}</td>
                          <td className="px-4 py-3">{item.email || '-'}</td>
                          <td className="px-4 py-3">
                            {item.country_code && item.mobile_without_country_code
                              ? `${item.country_code} ${item.mobile_without_country_code}`
                              : '-'}
                          </td>
                          <td className="px-4 py-3">{item.company || '-'}</td>
                          <td className="px-4 py-3">{item.city || '-'}</td>
                          <td className="px-4 py-3">
                            {item.crm_status || '-'}
                          </td>
                          <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                            {item.crm_note || '-'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
