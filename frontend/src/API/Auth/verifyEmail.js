const verifyEmail = async (userId, otp) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/verify-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default verifyEmail;
