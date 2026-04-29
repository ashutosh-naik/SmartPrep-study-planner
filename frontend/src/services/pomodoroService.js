import axiosInstance from './axiosInstance';

export const pomodoroService = {
    getLogs: async () => {
        const response = await axiosInstance.get('/pomodoro');
        return response.data;
    },
    createLog: async (log) => {
        const response = await axiosInstance.post('/pomodoro', log);
        return response.data;
    }
};
