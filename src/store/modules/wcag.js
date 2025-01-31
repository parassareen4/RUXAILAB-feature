const state = {
    evaluationReports: []
};

const mutations = {
    ADD_WCAG_REPORT(state, report) {
        state.evaluationReports.push(report);
    }
};

const actions = {
    async generateWcagReport({ commit }, reportData) {
        // Save to Firebase or your backend
        const reportRef = await db.collection('wcagReports').add(reportData);
        commit('ADD_WCAG_REPORT', { id: reportRef.id, ...reportData });
        return reportRef.id;
    }
};

export default {
    state,
    mutations,
    actions
}; 