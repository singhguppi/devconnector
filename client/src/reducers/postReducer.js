import {
  ADD_POST,
  GET_POST,
  POST_LOADING,
  GET_POSTS,
  DELETE_POST
} from "../actions/type";
const intialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = intialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    default:
      return state;
  }
}
