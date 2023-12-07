const deleteIssues = async (Id, feedback) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/complaint/resolve-complaint`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id, feedback }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default deleteIssues;
