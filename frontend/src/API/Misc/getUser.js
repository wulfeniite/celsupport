const getUser = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/get-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getUser;
