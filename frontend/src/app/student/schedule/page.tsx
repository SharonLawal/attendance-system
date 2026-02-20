"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { WEEKDAYS, SCHEDULE_DATA } from "@/lib/demodata";

export default function StudentSchedule() {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-babcock-blue" />
            Class Schedule
          </h1>
          <p className="text-slate-500 mt-1">Your weekly timetable and automated class reminders.</p>
        </div>

        <div className="bg-white border text-left border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col space-y-8">
            {WEEKDAYS.map((day) => {
              const dayClasses = SCHEDULE_DATA.filter((c) => c.day === day)
                .sort((a, b) => a.time.localeCompare(b.time));
              const isToday = day === currentDay;

              return (
                <div key={day} className={`relative pl-4 sm:pl-8 border-l-2 ${isToday ? 'border-babcock-blue' : 'border-slate-100'}`}>
                  {/* Timeline dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${isToday ? 'bg-babcock-blue shadow-md' : 'bg-slate-300'}`} />

                  <div className="flex items-center gap-3 mb-4">
                    <h3 className={`font-display font-bold text-lg ${isToday ? 'text-babcock-blue' : 'text-slate-700'}`}>{day}</h3>
                    {isToday && <Badge variant="babcock" className="text-[10px] uppercase tracking-wider scale-90">Today</Badge>}
                  </div>

                  {dayClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dayClasses.map((cls, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-babcock-blue/50 transition-colors group">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={cls.type === "Lecture" ? "neutral" : cls.type === "Lab" ? "default" : "warning"} className="px-2 py-0 border-transparent">
                              {cls.type}
                            </Badge>
                            <div className="flex items-center text-slate-500 text-xs font-semibold gap-1 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                              <Clock className="w-3 h-3" />
                              {cls.time.split(' - ')[0]}
                            </div>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">{cls.course}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cls.title}</p>
                          <div className="flex items-center gap-1 mt-3 text-xs text-slate-600 font-medium bg-slate-200/50 w-fit px-2 py-1 rounded-md">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {cls.room}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 font-medium italic py-2">
                      No classes scheduled.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
