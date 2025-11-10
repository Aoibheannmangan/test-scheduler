import { useState } from "react";

// Declares hook that takes appointments array
export const useAppointmentFilters = (appointments) => {
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [selectedStudies, setSelectedStudies] = useState([
    "AIMHIGH",
    "COOLPRIME",
    "EDI",
  ]);
  const [selectedRooms, setSelectedRooms] = useState([
    "TeleRoom",
    "room1",
    "room2",
    "room3",
    "room4",
    "devRoom",
  ]);

  // Toggle study selection
  const handleStudyChange = (study) => {
    setSelectedStudies((prev) =>
      prev.includes(study) ? prev.filter((s) => s !== study) : [...prev, study]
    );
  };

  // Toggle room selection
  const handleRoomChange = (room) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  // Filter logic
  const filteredAppointments = appointments.filter((event) => {
    // Check if ID or title matches search
    const matchesTitleOrId =
      (event.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.id?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    // Study filter
    const matchesStudy = Array.isArray(event.Study)
      ? event.Study.some((study) => selectedStudies.includes(study))
      : selectedStudies.includes(event.Study);

    // Room filter
    // If no room is selected, don't filter by room (show all)
    const matchesRoom =
      selectedRooms.length === 0 ||
      !event.room ||
      selectedRooms.includes(event.room);

    return matchesTitleOrId && matchesStudy && matchesRoom;
  });

  // Return state and handlers
  return {
    searchQuery,
    setSearchQuery,
    selectedStudies,
    handleStudyChange,
    selectedRooms,
    handleRoomChange,
    filteredAppointments,
  };
};
