const renameFile = (path, name, newName) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ path, name, newName });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return new Promise((resolve) => {
    fetch('http://localhost:4000/api/file', requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
};

export default renameFile;
