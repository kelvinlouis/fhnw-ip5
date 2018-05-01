const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function getJSON(url) {
  return fetch(`${BACKEND_URL}${url}`, {
    mode: 'cors',
  });
}

function post(url, payload) {
  return fetch(`${BACKEND_URL}${url}`, {
    mode: 'cors',
    body: JSON.stringify(payload),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
  });
}

function put(url, payload) {
  return fetch(`${BACKEND_URL}${url}`, {
    mode: 'cors',
    body: JSON.stringify(payload),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    },
    method: 'PUT',
  });
}

export async function getGraphNameList() {
  const response = await getJSON('/api/graph/?fields=id,name');

  if (response.ok) {
    const json = await response.json();

    return json.graphs || [];
  }

  return [];
}

export async function getGraph(id) {
  const response = await getJSON(`/api/graph/${id}`);

  if (response.ok) {
    return await response.json();
  }

  console.error(`API-Service: No graph found with id: ${id}`);
  return null;
}

export async function getGraphFilters(id) {
  const response = await getJSON(`/api/graph/${id}/filters`);

  if (response.ok) {
    const json = await response.json();

    if (json.filters) {
      return json.filters;
    }
  }

  console.error(`API-Service: No filters for graph found with id: ${id}`);
  return null;
}

export async function createGraph(payload) {
  const response = await post('/api/graph/', payload);

  if (response.ok) {
    return response.json();
  }

  console.error('API-Service: Graph couldn\'t be saved');
  return null;
}

export async function createGraphSnapshot(id, payload) {
  const response = await post(`/api/graph/${id}/snapshot`, payload);

  if (response.ok) {
    return response.json();
  }

  console.error(`API-Service: No snapshot created for graph with id: ${id}`);
  return payload;
}

export async function saveGraphFilters(id, payload) {
  const response = await put(`/api/graph/${id}/filters`, { filters: payload });

  if (response.ok) {
    return true;
  }

  console.error(`API-Service: Filter of graph with id ${id} couldn't be saved`);
  return false;
}
