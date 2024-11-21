import api from "./api";

// Function to sign up a new user
const signupUser = async (name, email, password) => {
  try {
    const response = await api.post("/auth/signup", {
      email: email,
      password: password,
      name: name,
    });
    console.log("User signed up successfully:", response.data);
    return response.data;
  } catch (error) {
    // Extract the error message from the response
    const errorMessage =
      error.response?.data?.detail?.[0]?.msg ||
      error.response?.data?.detail ||
      "Signup failed";
    console.error("Signup error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default signupUser;
