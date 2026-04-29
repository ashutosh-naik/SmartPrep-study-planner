export const goalService = {
    getGoals: async () => {
        try {
            return JSON.parse(localStorage.getItem('sp_goals') || '[]');
        } catch (e) {
            return [];
        }
    },
    createGoal: async (goal) => {
        const goals = JSON.parse(localStorage.getItem('sp_goals') || '[]');
        const newGoal = {
            ...goal,
            id: Date.now().toString(),
            startDate: Date.now(),
            progress: 0
        };
        goals.push(newGoal);
        localStorage.setItem('sp_goals', JSON.stringify(goals));
        // Dashboard expects the new goal inside a `data` wrapper based on the axios response structure it used to have
        return { data: newGoal };
    },
    deleteGoal: async (id) => {
        let goals = JSON.parse(localStorage.getItem('sp_goals') || '[]');
        goals = goals.filter(g => g.id !== id);
        localStorage.setItem('sp_goals', JSON.stringify(goals));
        return { success: true };
    }
};
