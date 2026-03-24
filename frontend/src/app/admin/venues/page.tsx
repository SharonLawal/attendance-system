"use client";

/**
 * @fileoverview Contextual execution boundary for frontend/src/app/admin/venues/page.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MapPin, Navigation, Trash2, Loader2, Save, X, Edit, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

interface Coordinate {
    lat: number;
    lng: number;
}

export default function AdminVenueManager() {
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<"list" | "geofence">("list");
    const [editingVenue, setEditingVenue] = useState<any | null>(null);

    const [name, setName] = useState("");
    const [building, setBuilding] = useState("");
    const [capacity, setCapacity] = useState("");
    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);

    const { data: venues, isLoading } = useQuery({
        queryKey: ["admin", "classrooms"],
        queryFn: async () => {
            const res = await apiClient.get("/api/classrooms");
            return res.data.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/api/classrooms/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "classrooms"] });
            toast.success("Venue deactivated.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete venue.");
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (editingVenue) {
                return apiClient.put(`/api/classrooms/${editingVenue._id}`, payload);
            }
            return apiClient.post("/api/classrooms", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "classrooms"] });
            toast.success(editingVenue ? "Venue updated successfully." : "Venue successfully mapped and saved.");
            resetForm();
            setViewMode("list");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to save venue geofence.");
        },
    });

    const resetForm = () => {
        setEditingVenue(null);
        setName("");
        setBuilding("");
        setCapacity("");
        setCoordinates([]);
    };

    const handleEdit = (venue: any) => {
        setEditingVenue(venue);
        setName(venue.name);
        setBuilding(venue.building);
        setCapacity(venue.capacity.toString());
        
        try {
            const polyCoords = venue.locationPolygon?.coordinates[0];
            if (polyCoords && polyCoords.length > 0) {

                const uiCoords = polyCoords.slice(0, polyCoords.length - 1).map((coord: number[]) => ({
                    lng: coord[0],
                    lat: coord[1]
                }));
                setCoordinates(uiCoords);
            } else {
                setCoordinates([]);
            }
        } catch {
            setCoordinates([]);
        }
        
        setViewMode("geofence");
    };

    const handleCreateNew = () => {
        resetForm();
        setViewMode("geofence");
    };

    const handleCaptureLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setIsCapturing(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoord = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCoordinates((prev) => [...prev, newCoord]);
                toast.success("Corner point captured!");
                setIsCapturing(false);
            },
            (error) => {
                setIsCapturing(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Location access denied. Please enable GPS permissions.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Location information is unavailable. Try moving outside.");
                        break;
                    case error.TIMEOUT:
                        toast.error("The request to get user location timed out.");
                        break;
                    default:
                        toast.error("An unknown error occurred while capturing location.");
                        break;
                }
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    };

    const handleAutoGenerateBox = () => {
        if (coordinates.length === 0) {
            toast.error("Please capture at least one point to use as the center.");
            return;
        }
        
        const center = coordinates[coordinates.length - 1];

        const offset = 0.00015;
        
        const boxCorners = [
            { lat: center.lat + offset, lng: center.lng + offset },
            { lat: center.lat + offset, lng: center.lng - offset },
            { lat: center.lat - offset, lng: center.lng - offset },
            { lat: center.lat - offset, lng: center.lng + offset }
        ];
        
        setCoordinates(boxCorners);
        toast.success("Generated 15m bounding box from center point!");
    };

    const handleRemoveCoordinate = (index: number) => {
        setCoordinates(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!capacity || parseInt(capacity) <= 0) {
            toast.error("Please enter a valid student capacity.");
            return;
        }

        if (coordinates.length < 3) {
            toast.error("You must capture at least 3 distinct corners to form a polygon.");
            return;
        }

        const uniqueCoords = new Set(coordinates.map(c => `${c.lat.toFixed(7)},${c.lng.toFixed(7)}`));
        if (uniqueCoords.size < 3) {
            toast.error("You captured multiple coordinates in the exact same spot! Please click 'Auto 15m Box' to automatically generate a valid boundary.");
            return;
        }

        const geoJsonCoordinates = coordinates.map(coord => [coord.lng, coord.lat]);
        geoJsonCoordinates.push([...geoJsonCoordinates[0]]);

        const payload = {
            name,
            building: building || "Campus",
            capacity: parseInt(capacity),
            locationPolygon: {
                type: "Polygon",
                coordinates: [geoJsonCoordinates]
            }
        };

        saveMutation.mutate(payload);
    };

    const columns = [
        {
          header: "Venue Name",
          accessorKey: "name",
          cell: (item: any) => <span className="font-semibold text-slate-800">{item.name}</span>,
        },
        {
          header: "Building",
          accessorKey: "building",
          cell: (item: any) => <span className="text-slate-600 font-medium">{item.building}</span>,
        },
        {
          header: "Capacity",
          cell: (item: any) => (
            <Badge variant={item.capacity >= 100 ? "success" : "neutral"}>
              {item.capacity} Seats
            </Badge>
          ),
        },
        {
          header: "Geofence Status",
          cell: (item: any) => (
            <Badge variant={item.locationPolygon ? "babcock" : "warning"}>
              {item.locationPolygon ? "Active Polygon" : "Missing Poly"}
            </Badge>
          ),
        },
        {
          header: "Actions",
          cell: (item: any) => (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => {
                    if (window.confirm(`Are you sure you want to deactivate ${item.name}?`)) {
                        deleteMutation.mutate(item._id);
                    }
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ),
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 flex flex-col min-h-[85vh]">
                
                {viewMode === "list" && (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-babcock-blue" />
                                    Campus Venues Configuration
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    Manage physical classrooms and configure verified geographical boundaries.
                                </p>
                            </div>
                            <Button onClick={handleCreateNew} className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all">
                                <Plus className="w-4 h-4" /> Add Venue Layout
                            </Button>
                        </div>

                        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
                            <CardContent className="p-0">
                               {isLoading ? (
                                  <div className="flex justify-center flex-col gap-4 items-center py-24">
                                      <div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                                      <p className="text-slate-500 font-medium animate-pulse">Loading venue definitions...</p>
                                  </div>
                               ) : (
                                  <DataTable
                                    data={venues || []}
                                    columns={columns}
                                    emptyTitle="No Venues Configured"
                                    emptyDescription="Start mapping boundaries with the Mobile Geofencer to establish active verifiable check-in points."
                                  />
                               )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {viewMode === "geofence" && (
                    <div className="max-w-xl mx-auto w-full space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                onClick={() => setViewMode("list")}
                                className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                                    {editingVenue ? `Edit ${editingVenue.name}` : "Venue Geofencer"}
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Walk to the physical corners of the room and capture coordinates to verify boundaries.
                                </p>
                            </div>
                        </div>

                        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
                            <form onSubmit={handleSubmit}>
                                <CardHeader className="bg-white pb-4 border-b border-slate-100 p-4 sm:p-6">
                                    <CardTitle className="text-lg">Venue Details</CardTitle>
                                </CardHeader>
                                
                                <CardContent className="space-y-5 p-4 sm:p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 block mb-1">Classroom Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="e.g. SAT Lab 1"
                                                required
                                                className="w-full px-3 py-2 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-babcock-blue text-slate-800 text-sm sm:text-base outline-none transition-shadow"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 block mb-1">Building <span className="text-slate-400 font-normal">(Optional)</span></label>
                                                <input
                                                    type="text"
                                                    value={building}
                                                    onChange={e => setBuilding(e.target.value)}
                                                    placeholder="e.g. BBS Wing"
                                                    className="w-full px-3 py-2 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-babcock-blue text-slate-800 text-sm sm:text-base outline-none transition-shadow"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 block mb-1">Student Capacity</label>
                                                <input
                                                    type="number"
                                                    value={capacity}
                                                    onChange={e => setCapacity(e.target.value)}
                                                    placeholder="50"
                                                    required
                                                    min="1"
                                                    className="w-full px-3 py-2 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-babcock-blue text-slate-800 text-sm sm:text-base outline-none transition-shadow"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr className="border-slate-100" />

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-semibold text-slate-700 font-display">Boundary Points</label>
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-mono">
                                                [{coordinates.length}/4+] captured
                                            </span>
                                        </div>

                                        {/* Captured List UI */}
                                        {coordinates.length === 0 ? (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                                                <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                                                <p className="text-sm text-amber-800 font-medium">No coordinates mapped yet.</p>
                                                <p className="text-xs text-amber-600/80 mt-1">Stand in a corner and tap capture.</p>
                                            </div>
                                        ) : (
                                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                                {coordinates.map((coord, idx) => (
                                                    <li key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm group">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <span className="bg-babcock-blue/10 text-babcock-blue font-bold text-xs h-5 w-5 flex items-center justify-center rounded-full shrink-0">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="font-mono text-xs text-slate-600 truncate">
                                                                {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleRemoveCoordinate(idx)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                            aria-label="Delete coordinate"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-2 mt-2 border-t border-slate-100 pt-3">
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={handleCaptureLocation} 
                                                disabled={isCapturing}
                                                className="w-full flex-1 h-12 border-2 border-babcock-blue/20 text-babcock-blue hover:bg-babcock-blue/5 hover:border-babcock-blue hover:shadow-md transition-all font-semibold active:scale-[0.98]"
                                            >
                                                {isCapturing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin shrink-0" />
                                                        GPS...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Navigation className="w-5 h-5 mr-2 shrink-0" />
                                                        Capture Point
                                                    </>
                                                )}
                                            </Button>
                                            
                                            <Button 
                                                type="button"
                                                variant="secondary"
                                                onClick={handleAutoGenerateBox}
                                                disabled={coordinates.length === 0}
                                                title="If your device GPS isn't precise enough for distinct corners, capture one center point and click this to generate a 15m radius box."
                                                className="w-full sm:w-1/3 h-12 border border-transparent text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all font-semibold active:scale-[0.98] shrink-0"
                                            >
                                                Auto 15m Box
                                            </Button>
                                        </div>
                                        {coordinates.length > 0 && coordinates.length < 3 && (
                                             <p className="text-xs text-red-500 text-center font-medium mt-2">
                                                 * Minimum 3 corners required to form a zone.
                                             </p>
                                        )}
                                    </div>

                                </CardContent>
                                <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 sm:p-6 flex justify-end gap-3 z-10">
                                    <Button 
                                        variant="ghost" 
                                        type="button" 
                                        onClick={() => setViewMode("list")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        isLoading={saveMutation.isPending} 
                                        disabled={coordinates.length < 3 || saveMutation.isPending}
                                        className="shadow-lg hover:shadow-xl transition-all font-semibold"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Venue Definition
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
