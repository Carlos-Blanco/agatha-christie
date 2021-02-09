import { createStore } from "vuex";
import * as user from "@/store/modules/user.js";
import * as books from "@/store/modules/books.js";

export default createStore({
  modules: {
    user,
    books
  }
});
