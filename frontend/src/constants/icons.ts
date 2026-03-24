/**
 * @fileoverview Contextual execution boundary for frontend/src/constants/icons.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
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
