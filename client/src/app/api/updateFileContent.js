function updateFileContent(path, name, content) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const body = { path, name, content };

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: 'follow',
  };

  /* eslint-disable */
  return new Promise((resolve, reject) => {
    fetch('http://localhost:4000/api/file/content', requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
}

export default updateFileContent;
