'use client';

import { useState, useEffect } from 'react';
import { parseCSV } from '../lib/csv-parser';
import VirtualizedTable from './VirtualizedTable';

export default function CsvPreview({ file, maxRows = 20 }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useVirtualized, setUseVirtualized] = useState(false);

  useEffect(() => {
    if (file) {
      setLoading(true);
      setError(null);
      
      parseCSV(file)
        .then((result) => {
          setHeaders(result.headers);
          const allData = result.data;
          setData(allData.slice(0, maxRows));
          setUseVirtualized(allData.length > 100);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to parse CSV file');
          setLoading(false);
        });
    }
  }, [file, maxRows]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No data found in CSV</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
        <p className="text-sm font-medium">
          Previewing {Math.min(data.length, maxRows)} of {data.length} rows
        </p>
        {useVirtualized && (
          <span className="text-xs text-muted-foreground">Virtualized mode enabled</span>
        )}
      </div>
      {useVirtualized ? (
        <VirtualizedTable headers={headers} data={data} height={384} rowHeight={50} />
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left font-medium whitespace-nowrap border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-muted/50">
                    {headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 whitespace-nowrap text-muted-foreground"
                      >
                        {row[header] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
