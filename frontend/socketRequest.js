import axios from "axios";

axios.get('https://chat-app-yt.onrender.com/socket.io/')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });