const register = async (name, email, department, mobile, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, department, mobile }),
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export default register;
