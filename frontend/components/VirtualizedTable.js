'use client';

import { useState } from 'react';
import { FixedSizeList as List } from 'react-window';

export default function VirtualizedTable({ headers, data, height = 400, rowHeight = 50 }) {
  const Row = ({ index, style }) => (
    <div style={style} className="flex items-center border-b hover:bg-muted/50">
      {headers.map((header, i) => (
        <div
          key={`${header}-${i}`}
          className="px-4 py-3 text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          title={data[index][header] || '-'}
        >
          {data[index][header] || '-'}
        </div>
      ))}
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted flex items-center border-b">
        {headers.map((header, i) => (
          <div
            key={header}
            className="px-4 py-3 text-sm font-medium flex-1"
          >
            {header}
          </div>
        ))}
      </div>
      
      {/* Virtualized Body */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}
