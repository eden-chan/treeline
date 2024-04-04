import React from 'react';
import ActivityCalendar from 'react-activity-calendar';

const LearningActivityCalendar = () => {
    const data = [
        {
            "date": "2023-06-14",
            "count": 2,
            "level": 1
        },
        {
            "date": "2023-06-22",
            "count": 16,
            "level": 3
        },
        {
            "date": "2024-06-22",
            "count": 16,
            "level": 3
        }
    ];

    return <ActivityCalendar data={data} />;
}

export default LearningActivityCalendar;
