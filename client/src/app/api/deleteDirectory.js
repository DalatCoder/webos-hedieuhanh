const renameDirectory = (path, name) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ path, name });

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return new Promise((resolve) => {
    fetch('http://localhost:4000/api/directory', requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
};

export default renameDirectory;
