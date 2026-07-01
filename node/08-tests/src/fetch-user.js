import axios from "axios";

export async function fetchUserName(id) {
  const response = await axios.get(`https://api.example.com/users/${id}`);
  return response.data.name;
}
