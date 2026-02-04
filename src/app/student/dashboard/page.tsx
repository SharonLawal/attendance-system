import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/ui/StatsCard";
import { Icons } from "@/constants/icons";

export default function StudentDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar role="STUDENT" />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500">Welcome back to the attendance portal.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Attendance" 
            value="85%" 
            description="Across all courses"
            icon={Icons.Success}
            variant="success"
          />
          <StatsCard 
            title="Active Sessions" 
            value="1" 
            description="CS 401: Software Quality"
            icon={Icons.Location}
            variant="warning"
          />
          <StatsCard 
            title="Warnings" 
            value="0" 
            description="75% threshold status"
            icon={Icons.Warning}
            variant="default"
          />
        </div>
      </main>
    </div>
  );
}