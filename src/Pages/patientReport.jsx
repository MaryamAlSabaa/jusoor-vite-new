import React, { useState } from "react";
import { Download, Share2, Eye, Calendar, Send } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Blood Test - Complete Blood Count (CBC)",
    date: "2025-10-03",
    type: "Blood Test",
    pdf: "/reports/cbc-report.pdf",
  },
  {
    id: 2,
    name: "MRI Scan - Brain",
    date: "2025-09-25",
    type: "Imaging",
    pdf: "/reports/mri-brain.pdf",
  },
  {
    id: 3,
    name: "X-Ray - Chest",
    date: "2025-08-15",
    type: "Imaging",
    pdf: "/reports/chest-xray.pdf",
  },
  {
    id: 4,
    name: "COVID-19 PCR Test",
    date: "2025-07-22",
    type: "Lab Test",
    pdf: "/reports/pcr-test.pdf",
  },
];

export default function MedicalReports() {
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      setFilteredReports(reports.filter((r) => r.date >= date));
    } else {
      setFilteredReports(reports);
    }
  };

  const handleShare = (report) => {
    navigator.clipboard.writeText(`Shared report: ${report.name} (${report.date})`);
    alert("Report link copied to clipboard!");
  };

  const handleView = (pdf) => {
    window.open(pdf, "_blank");
  };

  const handleSendAll = () => {
    alert("All reports have been sent to your doctor!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🩺 Medical Reports & Tests</h2>

      {/* Filter Section */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-gray-600" />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilter}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={() => {
            setSelectedDate("");
            setFilteredReports(reports);
          }}
          className="ml-auto text-sm text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{report.name}</h3>
              <p className="text-sm text-gray-500">
                {report.type} • {report.date}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleView(report.pdf)}
                className="p-2 rounded-full hover:bg-blue-50"
                title="View Report"
              >
                <Eye className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => handleShare(report)}
                className="p-2 rounded-full hover:bg-green-50"
                title="Share Report"
              >
                <Share2 className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={() => handleView(report.pdf)}
                className="p-2 rounded-full hover:bg-gray-50"
                title="Download Report"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No reports found for this date.</p>
        )}
      </div>

      {/* Send All Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSendAll}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          <Send className="w-5 h-5" /> Send All Reports to Doctor
        </button>
      </div>
    </div>
  );
}
