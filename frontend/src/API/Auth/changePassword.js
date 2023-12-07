const changePassword = async (userId, oldPassword, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/change-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, password }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default changePassword;
