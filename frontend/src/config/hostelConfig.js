// Room configuration with seat capacity
export const roomConfiguration = [
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '101', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '102', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '103', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '201', totalSeats: 4 },
    { hostel: 'Shaheed Rafiq Uddin Hall', room: '202', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '101', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '102', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '103', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '201', totalSeats: 4 },
    { hostel: 'Begum Sufia Kamal Hall', room: '202', totalSeats: 4 },
];

export const getUniqueHostels = () => {
    return [...new Set(roomConfiguration.map(item => item.hostel))];
};

export const getRoomsByHostel = (hostelName) => {
    return roomConfiguration.filter(item => item.hostel === hostelName);
};
