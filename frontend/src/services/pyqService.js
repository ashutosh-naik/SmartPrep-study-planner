import axios from './axiosInstance';

const pyqService = {
  getUniversities: () => axios.get('/pyqs/universities'),
  getCourses: (universityId) => axios.get(`/pyqs/courses?university=${universityId}`),
  getPapers: (university, course, year) => {
    let url = `/pyqs/papers?university=${university}&course=${course}`;
    if (year && year !== 'all') {
      url += `&year=${year}`;
    }
    return axios.get(url);
  },
};

export default pyqService;
