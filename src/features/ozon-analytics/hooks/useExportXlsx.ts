import * as XLSX from 'xlsx';
import { useCallback } from 'react';

export function useExportXlsx() {
  const exportToExcel = useCallback((data: Record<string, unknown>[], filename: string, sheetName: string = 'Sheet1') => {
    if (!data || data.length === 0) return;
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Write the workbook and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }, []);

  return { exportToExcel };
}
