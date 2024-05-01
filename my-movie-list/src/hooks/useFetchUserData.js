import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export function useFetchUserData() {
  const [userData, setUserData] = useState();
  const { getToken } = useAuth();

  useEffect(() => {
    if (getToken()) {
      const getUserInfo = async () => {
        try {
          const token = getToken();
          const response = await axios.get("http://localhost:3000/user", {
            headers: {
              authorization: token,
            },
          });
          console.log(response.data[0]);
          setUserData(response.data[0]);
          const userData = JSON.stringify(response.data[0]);
          localStorage.setItem("userData", userData);
        } catch (error) {
          if (error.response) {
            // The server responded with a status code that falls out of the range of 2xx
            console.error("Get Error:", error.response.data);
            console.error("Status Code:", error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error("Request Error:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", error.message);
          }
        }
      };
      getUserInfo();
    }
  }, [getToken]);

  return userData;
}
