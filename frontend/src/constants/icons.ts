import { 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut,
  LayoutDashboard
} from "lucide-react";

export const Icons = {
  User,
  Location: MapPin,
  Time: Clock,
  Success: CheckCircle,
  Warning: AlertTriangle,
  Logout: LogOut,
  Dashboard: LayoutDashboard
} as const;
