const fetchDirectory = (path) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  return new Promise((resolve) => {
    fetch(`/api/directory?path=${path}`, requestOptions)
      .then((raw) => raw.json())
      .then((response) => {
        const res = { ...response };
        if (res.data && res.data.items) {
          res.data.items = res.data.items.map((item) => {
            const dir = { ...item };
            dir.title = dir.name;
            dir.selected = false;
            if (dir.isFolder) dir.folder = true;
            return dir;
          });
        }

        resolve(res);
      })
      .catch((err) => {
        console.error(err);
        alert('Oops! Something went wrong!');
        resolve(null);
      });
  });
};

export default fetchDirectory;
