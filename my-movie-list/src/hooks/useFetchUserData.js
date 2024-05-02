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
          const response = await axios.get(
            "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/user",
            {
              headers: {
                authorization: token,
              },
            }
          );
          setUserData(response.data[0]);
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
