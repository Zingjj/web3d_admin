import { getCampusList } from "@/api/campusData.js";
const state = {
  campusSelectOptions: []
}
const mutations = {
  SET_CAMPUSSELECTOPTIONS(state, payload) {
    state.campusSelectOptions = payload;
  }
}
const actions = {
  getCampusSelectOptions({ commit }) {
    return getCampusList()
    .then((res) => {
      let campusListAll = [];
      for (let item of res.data) {
        campusListAll.push({
          id: item.campusId,
          campusName: item.campusName,
          disabled: item.campusId == 9
        });
      }
      commit('SET_CAMPUSSELECTOPTIONS', campusListAll);
    })
    .catch((err) => {
      this.$message.error(err.message);
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}