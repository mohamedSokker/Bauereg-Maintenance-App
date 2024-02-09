const fetchDataOnly = async (url, method, body, token) => {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    } else {
      return data;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
    return null;
  }
};

export default fetchDataOnly;
