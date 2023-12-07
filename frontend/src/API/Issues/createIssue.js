const createIssue = async (userId, title, description) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/complaint/create-complaint`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, description }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default createIssue;
