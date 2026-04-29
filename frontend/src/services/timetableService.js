import axiosInstance from './axiosInstance';

export const timetableService = {
    getSlots: async () => {
        const res = await axiosInstance.get('/timetable');
        return res.data?.data ?? [];
    },
    createSlot: async (slot) => {
        const res = await axiosInstance.post('/timetable', slot);
        return res.data?.data;
    },
    deleteSlot: async (id) => {
        await axiosInstance.delete(`/timetable/${id}`);
    },
};
