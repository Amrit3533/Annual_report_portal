const API = import.meta.env.VITE_API_URL;

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  await fetch(`${API}/api/financial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
};
