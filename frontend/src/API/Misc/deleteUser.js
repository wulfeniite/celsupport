const getUser = async (userId, userToDeleteId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/delete-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userToDeleteId }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getUser;
