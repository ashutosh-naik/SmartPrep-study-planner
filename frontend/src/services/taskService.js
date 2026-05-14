import axiosInstance from './axiosInstance';

export const taskService = {
    /* ── Study-plan tasks ── */
    getTasks: async (filter = 'all') => {
        const response = await axiosInstance.get(`/tasks?filter=${filter}`);
        return response.data;
    },
    completeTask: async (id) => {
        const response = await axiosInstance.put(`/tasks/${id}/complete`);
        return response.data;
    },
    skipTask: async (id) => {
        const response = await axiosInstance.put(`/tasks/${id}/skip`);
        return response.data;
    },
    updateSubtask: async (id, type, completed) => {
        const response = await axiosInstance.put(`/tasks/${id}/subtask?type=${type}&completed=${completed}`);
        return response.data;
    },
    getTaskSummary: async () => {
        const response = await axiosInstance.get('/tasks/summary');
        return response.data;
    },
    createRecoveryRoadmap: async () => {
        const response = await axiosInstance.post('/tasks/recovery');
        return response.data;
    },

    /* ── Custom (personal) daily tasks ── */
    getCustomTasks: async (filter = 'all') => {
        const response = await axiosInstance.get(`/tasks/custom?filter=${filter}`);
        return response.data;
    },
    createCustomTask: async (taskData) => {
        const response = await axiosInstance.post('/tasks/custom', taskData);
        return response.data;
    },
    updateCustomTask: async (id, taskData) => {
        const response = await axiosInstance.put(`/tasks/custom/${id}`, taskData);
        return response.data;
    },
    deleteCustomTask: async (id) => {
        const response = await axiosInstance.delete(`/tasks/custom/${id}`);
        return response.data;
    }
};
