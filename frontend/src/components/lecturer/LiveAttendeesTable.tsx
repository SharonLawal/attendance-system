import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Smartphone,
  AlertTriangle 
} from 'lucide-react';
import { 
  useApprovePendingAttendance, 
  useRejectPendingAttendance 
} from '@/hooks/useLecturerData';

interface Attendee {
  id: string;
  studentName: string;
  studentEmail: string;
  studentMatricNumber: string;
  status: 'Present' | 'Pending' | 'Absent';
  checkedInAt: string;
  distanceFromSession: number | null;
  requiresManualReview: boolean;
  deviceInfo?: string;
}

interface LiveAttendeesTableProps {
  attendees: Attendee[];
  summary: {
    total: number;
    present: number;
    pending: number;
    absent: number;
    presentPercentage: number;
  };
}

export const LiveAttendeesTable: React.FC<LiveAttendeesTableProps> = ({
  attendees,
  summary,
}) => {
  const [filter, setFilter] = useState<'all' | 'present' | 'pending'>('all');
  const approveMutation = useApprovePendingAttendance();
  const rejectMutation = useRejectPendingAttendance();

  const filteredAttendees = attendees.filter(attendee => {
    if (filter === 'all') return true;
    if (filter === 'present') return attendee.status === 'Present';
    if (filter === 'pending') return attendee.status === 'Pending';
    return true;
  });

  const handleApprove = (recordId: string) => {
    approveMutation.mutate(recordId);
  };

  const handleReject = (recordId: string) => {
    if (confirm('Are you sure you want to reject this attendance?')) {
      rejectMutation.mutate({ recordId });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {/* Summary Stats */}
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">{summary.total}</p>
            <p className="text-sm text-neutral-600">Total Enrolled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{summary.present}</p>
            <p className="text-sm text-neutral-600">Present</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{summary.pending}</p>
            <p className="text-sm text-neutral-600">Pending Review</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-rose-600">{summary.absent}</p>
            <p className="text-sm text-neutral-600">Not Checked In</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 pt-4 flex gap-4 border-b border-neutral-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-4 font-medium transition-colors ${
            filter === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          All ({attendees.length})
        </button>
        <button
          onClick={() => setFilter('present')}
          className={`pb-2 px-4 font-medium transition-colors ${
            filter === 'present'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Present ({summary.present})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`pb-2 px-4 font-medium transition-colors ${
            filter === 'pending'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Pending Review ({summary.pending})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                Student
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                Check-in Time
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  No attendees in this category
                </td>
              </tr>
            ) : (
              filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {attendee.studentName}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {attendee.studentMatricNumber}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {attendee.status === 'Present' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={14} />
                          Present
                        </span>
                      )}
                      {attendee.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                      {attendee.status === 'Absent' && (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                         <XCircle size={14} />
                         Rejected
                       </span>
                      )}
                      {attendee.requiresManualReview && attendee.status === 'Pending' && (
                        <div title="Requires manual review">
                          <AlertTriangle size={14} className="text-amber-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-600">
                      {new Date(attendee.checkedInAt).toLocaleTimeString()}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {attendee.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(attendee.id)}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-medium disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(attendee.id)}
                          disabled={rejectMutation.isPending}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-lg font-medium disabled:opacity-50 flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                    {attendee.status === 'Present' && (
                      <span className="text-sm text-emerald-600 font-medium">Confirmed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
