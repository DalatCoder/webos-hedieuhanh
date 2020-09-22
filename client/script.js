const pathEl = document.getElementById('path');
const itemsEl = document.getElementById('items');

const createApiURL = (path) => {
  return 'http://localhost:3000/directory?path=' + path;
};

let path = ['', 'mnt', 'c'];
const getPath = () => {
  if (path.length === 1) {
    return '/';
  }

  return path.join('/');
};

const render = (items, currentPath) => {
  pathEl.textContent = `All items in ${currentPath}`;
  itemsEl.innerHTML = '';

  for (let item of items) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = item;
    li.appendChild(a);

    li.addEventListener('click', () => {
      path.push(item);
      fetch(createApiURL(getPath()))
        .then((raw) => raw.json())
        .then((res) => {
          render(res.data.directories, getPath());
        })
        .catch((err) => {
          console.log(err);
        });
    });
    itemsEl.appendChild(li);
  }

  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = '#';
  a.textContent = '< Back';
  li.appendChild(a);
  li.addEventListener('click', () => {
    path.pop();
    fetch(createApiURL(getPath()))
      .then((raw) => raw.json())
      .then((res) => {
        render(res.data.directories, getPath());
      })
      .catch((err) => {
        console.log(err);
      });
  });
  itemsEl.appendChild(li);
};

window.onload = () => {
  fetch(createApiURL(getPath()))
    .then((raw) => raw.json())
    .then((res) => {
      render(res.data.directories, getPath());
    })
    .catch((err) => {
      console.log(err);
    });
};
