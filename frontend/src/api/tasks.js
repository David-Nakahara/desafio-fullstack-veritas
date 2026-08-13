const API_URL = "http://localhost:8080";


async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${response.status}`);
  }
  if (response.status === 204) return null; // DELETE não retorna corpo
  return response.json();
}

export async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  return handleResponse(response);
}

export async function createTask({ title, description, status }) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status }),
  });
  return handleResponse(response);
}

export async function updateTask(id, { title, description, status }) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status }),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}