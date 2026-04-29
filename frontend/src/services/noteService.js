import axiosInstance from './axiosInstance';

export const noteService = {
    saveFlashcardResult: async (data) => {
        const response = await axiosInstance.post('/flashcards/submit', data);
        return response.data;
    },
    getFlashcardHistory: async () => {
        const response = await axiosInstance.get('/flashcards/history');
        return response.data;
    }
};
