const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function getGraphNameList() {
  const response = await fetch(`${BACKEND_URL}/api/graph?fields=id,name`);

  if (response.ok) {
    const json = await response.json();

    return json.graphs || [];
  }

  return [];
}

export async function getGraph(id) {
  const response = await fetch(`${BACKEND_URL}/api/graph/${id}`);

  if (response.ok) {
    return await response.json();
  }

  console.error(`API-Service: No Graph found with id: ${id}`);
  return null;
}
