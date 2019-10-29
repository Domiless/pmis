export default {
  state: {
    details: ""
  },
  mutations: {
    getArea(state, data) {
      state.details = data
    }
  }
}
