import React, { useEffect, useState} from 'react'; 
import { getAppointmentsPerMonth }  from '../hooks/forecast';

const Forecast = () => { 
    const [bookedEvents, setBookedEvents] = useState([]);
    const [monthlyCounts, setMonthlyCounts] = useState([]);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
        setBookedEvents(storedEvents);
    }, []);

    useEffect(() => {
        const counts = getAppointmentsPerMonth(bookedEvents);
        setMonthlyCounts(counts);
    }, [bookedEvents]);

    return ( 
        <div>
            <h1>Appointment Forecast</h1>

            {Object.keys(monthlyCounts).length === 0 ? (
                <p>There are currently no appointments booked</p>
            ) : (
                <ul>
                    {Object.entries(monthlyCounts)
                        .sort(([a], [b]) => {
                            const [monthA, yearA] = a.split(' ');
                            const [monthB, yearB] = b.split(' ');
                            const dateA = new Date(`${monthA} 1, ${yearA}`);
                            const dateB = new Date(`${monthB} 1, ${yearB}`);
                            return dateA - dateB;
                        })
                        .map(([monthYear, count]) => (
                        <li key={monthYear}>
                            {monthYear}: {count} appointment{count !== 1 ? 's' : ''}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    ); 
}; 

export default Forecast; 