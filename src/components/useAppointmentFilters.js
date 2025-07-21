import { useState } from 'react';

export const useAppointmentFilters = (appointments) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudies, setSelectedStudies] = useState(['AIMHIGH', 'COOLPRIME', 'EDI']);

  const handleStudyChange = (study) => {
    setSelectedStudies((prev) =>
      prev.includes(study)
        ? prev.filter((s) => s !== study)
        : [...prev, study]
    );
  };

  const filteredAppointments = appointments.filter((event) => {
    const matchesTitleOrId =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudy = selectedStudies.includes(event.study);
    return matchesTitleOrId && matchesStudy;
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedStudies,
    handleStudyChange,
    filteredAppointments
  };
};