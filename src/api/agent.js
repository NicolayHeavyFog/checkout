import axios from 'axios'
import { store } from '~/store'

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

class ApiSuccess {
  constructor(message, statusCode, data) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}


const getMessage = (messages, status, method) => {
  let message = "Внутренняя ошибка, попробуйте повторить запрос позже";

  if (messages) {
    message = messages[status] ? messages[status] : message;

    if (messages[method] && messages[method][status]) {
      message = messages[method][status];
    }
  }
  return message;
}

export const agent = axios.create({
  baseURL: store.$state.baseURL
});

export const successHandler = (messages, response, method) => {
  const status = response.status;
  const message = getMessage(messages, status, method);

  return new ApiSuccess(message, status, response.data)
}

export const errorHandler = (messages, error, method) => {
  if (error.response) {
    console.warn(error.response.data);
    console.warn(error.response.headers);

    const status = error.response.status;
    const message = getMessage(messages, status, method);

    throw new ApiError(message, status);
  }
  throw error;
}


window.agent = agent;