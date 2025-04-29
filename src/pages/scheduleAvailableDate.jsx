import axios from 'axios';

const API_URL = 'http://localhost:8080/api/doctors/schedule-dates/doctor/{doctorId}';

export const scheduleAvailableDate = (doctorId, date) => {
  return axios.post(`${API_URL}/${doctorId}`, {}, {
    params: { availableDate: date },
  });
};
