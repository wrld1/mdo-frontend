"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ExcelData {
  [key: string]: string;
}

export default function ExcelTestPage() {
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("file", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
      const columnHeaders = Object.keys(data[0] || {});

      console.log("data", data);

      setExcelData(data);
      setColumns(columnHeaders);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    console.log("excelData", excelData);
  }, [excelData]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Excel Import Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="max-w-sm"
              />
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
            </div>

            {excelData.length > 0 && (
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {excelData.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={`${index}-${column}`}>
                            {row[column]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
