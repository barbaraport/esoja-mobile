import axios from 'axios';

const server_url = "192.168.1.2";

export const api = axios.create({
  baseURL: `http://${server_url}:8080/v1`
});

export const imageRecognition = axios.create({
  baseURL: `http://${server_url}:5000/`,
  headers: {
    'Content-Type':'application/json'
  }
});
