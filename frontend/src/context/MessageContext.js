import { createContext, useReducer } from 'react';

export const MessagesContext = createContext();

export const messagesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        messages: action.payload
      };
    case 'CREATE_MESSAGE':
      return {
        messages: [action.payload, ...state.messages]
      };
    case 'UPDATE_MESSAGE':
      return {
        messages: state.messages.map((message) =>
          message._id === action.payload._id ? { ...message, likes: action.payload.likes } : message
        )
      };
    default:
      return state;
  }
};

export const MessagesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, {
    messages: []
  });

  return (
    <MessagesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessagesContext.Provider>
  );
};