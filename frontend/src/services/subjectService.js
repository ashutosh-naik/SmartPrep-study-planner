import axiosInstance from './axiosInstance';

export const subjectService = {
    /** Fetch all subjects for the current user */
    getSubjects: async () => {
        const res = await axiosInstance.get('/subjects');
        return res.data;
    },

    /** Create a new subject */
    createSubject: async ({ name, difficulty, examId }) => {
        const res = await axiosInstance.post('/subjects', { name, difficulty, examId });
        return res.data;
    },

    /** Update a subject's name or difficulty */
    updateSubject: async (id, { name, difficulty }) => {
        const res = await axiosInstance.put(`/subjects/${id}`, { name, difficulty });
        return res.data;
    },

    /** Delete a subject (and all its topics) */
    deleteSubject: async (id) => {
        const res = await axiosInstance.delete(`/subjects/${id}`);
        return res.data;
    },

    /** Add a topic to a subject */
    addTopic: async (subjectId, { name, estimatedHours, status }) => {
        const res = await axiosInstance.post(`/subjects/${subjectId}/topics`, {
            name,
            estimatedHours: estimatedHours || null,
            status: status || 'NOT_STARTED',
        });
        return res.data;
    },

    /** Update a topic's status, name, or estimated hours */
    updateTopic: async (subjectId, topicId, { name, status, estimatedHours }) => {
        const res = await axiosInstance.put(`/subjects/${subjectId}/topics/${topicId}`, {
            name,
            status,
            estimatedHours: estimatedHours || null,
        });
        return res.data;
    },

    /** Delete a topic */
    deleteTopic: async (subjectId, topicId) => {
        const res = await axiosInstance.delete(`/subjects/${subjectId}/topics/${topicId}`);
        return res.data;
    },
};
