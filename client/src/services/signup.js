import api from "./api";

// Function to sign up a new user
const signupUser = async (name, email, password) => {
  try {
    const response = await api.post("/auth/signup", {
      email: email,
      password: password,
      name: name,
    });

    // Return the full response data which now includes tokens
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail?.[0]?.msg ||
      error.response?.data?.detail ||
      "Signup failed";
    console.error("Signup error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default signupUser;
