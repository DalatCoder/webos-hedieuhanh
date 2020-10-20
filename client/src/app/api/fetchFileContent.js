const fetchFileContent = (path, name) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  /* eslint-disable */
  return new Promise((resolve, reject) => {
    fetch(
      `http://localhost:4000/api/file/content?path=${path}&name=${name}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
};

export default fetchFileContent;
