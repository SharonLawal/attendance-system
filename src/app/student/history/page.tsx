import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AttendanceHistory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#003366]">Attendance History</h1>
        <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#003366]">
          <option>All Courses</option>
          <option>SENG 402</option>
          <option>COSC 401</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Course Code</th>
              <th className="px-6 py-4">Verification Method</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium">Oct 24, 2025</td>
              <td className="px-6 py-4">SENG 402</td>
              <td className="px-6 py-4">GPS + OTC</td>
              <td className="px-6 py-4">09:05 AM</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  <CheckCircle size={12} /> Present
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium">Oct 22, 2025</td>
              <td className="px-6 py-4">GEDS 400</td>
              <td className="px-6 py-4 text-slate-400">--</td>
              <td className="px-6 py-4 text-slate-400">--</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  <XCircle size={12} /> Absent
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium">Oct 20, 2025</td>
              <td className="px-6 py-4">COSC 301</td>
              <td className="px-6 py-4">LMS Sync (Teams)</td>
              <td className="px-6 py-4">02:00 PM</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  <AlertCircle size={12} /> Online
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}