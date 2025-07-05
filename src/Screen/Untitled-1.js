import axios from "axios";

const options = {
  method: 'POST',
  url: 'https://dnsconcierge.awd.world/api/loginUser',
  data: {email: '', password: ''}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});