import axios from "axios";

const options = {
  method: 'POST',
  url: `${process.env.EXPO_PUBLIC_API_URL}/loginUser`,
  data: {email: '', password: ''}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});