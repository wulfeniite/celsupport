const resetPassword = async (token, userId, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId, password }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default resetPassword;
