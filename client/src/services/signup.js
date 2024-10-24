import api from "./api";

// Function to sign up a new user
const signupUser = async (email, password) => {
  try {
    const response = await api.post("/auth/signup", { email, password });
    console.log("User signed up successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export default signupUser;
