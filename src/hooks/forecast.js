import { useState } from "react";

export function getAppointmentsPerMonth(appointments, month, year){
    const counts = {};

    appointments.forEach((event) => {
        if(!event.start) return;
        const date = new Date(event.start);
        if (isNaN(date)) return;

        const key= `${date.toLocaleString("default", {month: "long"})} ${date.getFullYear()}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
}

export function getWindowsPerMonth(studyWindows){
    const counts = {};
    studyWindows.forEach((window) => {
        if(!window.start) return;
        const date = new Date(window.start);
        if (isNaN(date)) return;

        const key= `${date.toLocaleString("default", {month: "long"})} ${date.getFullYear()}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    return counts;

}