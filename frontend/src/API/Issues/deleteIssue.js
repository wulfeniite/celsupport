const deleteIssues = async (Id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/complaint/delete-complaint`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default deleteIssues;
