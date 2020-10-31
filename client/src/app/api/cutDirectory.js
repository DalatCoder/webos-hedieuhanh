const cutDirectory = (src, dest, name) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ src, dest, name });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return new Promise((resolve) => {
    fetch('/api/directory/cut', requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
};

export default cutDirectory;
