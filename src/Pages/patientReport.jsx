import React, { useState, useEffect } from "react";
import { Download, Share2, Eye, Calendar, Send } from "lucide-react";
import { useAccessibility } from "../Entities/AccessibilityContext";

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
	const [showSample, setShowSample] = useState(false);
	const [samplePosition, setSamplePosition] = useState(null);
	const { isRTL, language } = useAccessibility();
	const t = (en, ar) => (isRTL ? ar : en);

	  useEffect(() => {
		loadUser();
	  }, [language]);
  const loadUser = async () => {
	try {
	  const userData = await User.me();
	  setUser(userData);
	} catch (error) {
	  console.error("Error loading user:", error);
	}
  };
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
		navigator.clipboard.writeText(
			`Shared report: ${report.name} (${report.date})`
		);
		alert("Report link copied to clipboard!");
	};

	const handleView = (pdf) => {
		window.open(pdf, "_blank");
	};

	const handleViewSample = (idx) => {
		setShowSample(true);
		setSamplePosition(idx);
	};

	const handleSendAll = () => {
		alert("All reports have been sent to your doctor!");
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">
				  {t("🩺 Medical Reports & Tests", "🩺 تقارير واختبارات طبية")} 
			</h2>

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

					 {t("Reset", "إعادة تعيين")} 
				</button>
			</div>

			{/* Reports List */}
			<div className="space-y-4">
				{filteredReports.map((report, idx) => (
					<React.Fragment key={report.id}>
						<div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
							<div>
								<h3 className="font-semibold text-gray-800">{report.name}</h3>
								<p className="text-sm text-gray-500">
									{report.type} • {report.date}
								</p>
							</div>

							<div className="flex items-center gap-3">
								<button
									onClick={() =>
										idx === 0 ? handleViewSample(idx) : handleView(report.pdf)
									}
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
						{/* Show sample below the clicked report only, not as a modal */}
						{showSample && samplePosition === idx && (
							<div className="mt-4 p-6 bg-white border border-blue-100 rounded-xl shadow-md">
								<h3 className="text-xl font-bold text-blue-700 mb-2">
									Sample Report: Blood Test - Complete Blood Count (CBC)
								</h3>
								<p className="text-gray-700 mb-2">Date: 2025-10-03</p>
								<div className="mb-3">
									<strong>Type:</strong> Blood Test
								</div>
								<div className="mb-3">
									<strong>Summary:</strong> CBC is a blood test used to evaluate your
									overall health and detect a wide range of disorders, including anemia,
									infection, and leukemia.
								</div>
								<table className="w-full text-sm mb-3 border">
									<thead>
										<tr className="bg-blue-50">
											<th className="p-2 border">Parameter</th>
											<th className="p-2 border">Result</th>
											<th className="p-2 border">Normal Range</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="p-2 border">WBC</td>
											<td className="p-2 border">6.2 x10^9/L</td>
											<td className="p-2 border">4.0 - 11.0</td>
										</tr>
										<tr>
											<td className="p-2 border">RBC</td>
											<td className="p-2 border">4.8 x10^12/L</td>
											<td className="p-2 border">4.2 - 5.9</td>
										</tr>
										<tr>
											<td className="p-2 border">Hemoglobin</td>
											<td className="p-2 border">13.5 g/dL</td>
											<td className="p-2 border">12.0 - 16.0</td>
										</tr>
										<tr>
											<td className="p-2 border">Platelets</td>
											<td className="p-2 border">220 x10^9/L</td>
											<td className="p-2 border">150 - 400</td>
										</tr>
									</tbody>
								</table>
								<div className="mb-2">
									<strong>Doctor's Note:</strong> All values are within normal range. No
									signs of infection or anemia.
								</div>
								<button
									onClick={() => window.open("/reports/cbc-report.pdf", "_blank")}
									className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
								>
									View Full Report (PDF)
								</button>
								<button
									onClick={() => setShowSample(false)}
									className="mt-3 ml-3 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
								>
									Close
								</button>
							</div>
						)}
					</React.Fragment>
				))}

				{filteredReports.length === 0 && (
					<p className="text-center text-gray-500 mt-10">
						No reports found for this date.
					</p>
				)}
			</div>

			{/* Send All Button */}
			<div className="mt-8 flex justify-center">
				<button
					onClick={handleSendAll}
					className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
				>
					<Send className="w-5 h-5" /> {t("Send All Reports to Doctor", "إرسال جميع التقارير إلى الطبيب")}
				</button>
			</div>
		</div>
	);
}
