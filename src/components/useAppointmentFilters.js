import { useState } from 'react';

// Declares hook that takes appointments array
export const useAppointmentFilters = (appointments) => {
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [selectedStudies, setSelectedStudies] = useState(['AIMHIGH', 'COOLPRIME', 'EDI']);

  // Defines function to toggle a study in or out of selected studies 
  const handleStudyChange = (study) => {
    // Updates state
    setSelectedStudies((prev) =>
      prev.includes(study)
        ? prev.filter((s) => s !== study)
        : [...prev, study]
    );
  };

  // Filter logic
  const filteredAppointments = appointments.filter((event) => {
    // Check if ID matches
    const matchesTitleOrId =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase());
    // Checks if study matches
      const matchesStudy = selectedStudies.includes(event.study);
    return matchesTitleOrId && matchesStudy;
  });

  // Output value, updater function for filtering
  return {
    searchQuery,
    setSearchQuery,
    selectedStudies,
    handleStudyChange,
    filteredAppointments
  };
};