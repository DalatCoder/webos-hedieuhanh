async function handleDeleteButton(currentPath, item, closeModal, callback) {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
  };

  let url = 'http://localhost:4000/api';

  if (item.isFolder) {
    url = `${url}/directory?path=${currentPath}&name=${item.name}`;
  } else {
    url = `${url}/file?path=${currentPath}&filename=${item.name}`;
  }

  try {
    const raw = await fetch(url, requestOptions);
    const res = await raw.json();

    if (res.error) callback(res.error, null);
    else callback(null, res.data);
  } catch (error) {
    console.log('error', error);
    callback(error.message, null);
  } finally {
    closeModal();
  }
}

export default function renderDeleteModal(item, currentPath, callback) {
  const modal = document.getElementById('delete-item');

  const wrapper = document.createElement('div');

  const heading = document.createElement('p');
  heading.classList.add('text-danger');
  heading.classList.add('lead');
  heading.classList.add('mb-3');
  heading.classList.add('text-center');

  heading.textContent = `Delete ${item.isFolder ? 'folder' : 'file'} "${
    item.name
  }"?`;

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn');
  btnDelete.classList.add('btn-danger');
  btnDelete.classList.add('btn-block');
  btnDelete.classList.add('mb-5');
  btnDelete.textContent = 'Delete';

  btnDelete.addEventListener('click', () => {
    handleDeleteButton(
      currentPath,
      item,
      function closeModal() {
        modal.hidden = true;
      },
      callback,
    );
  });

  const hr = document.createElement('hr');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('btn');
  btnCancel.classList.add('btn-info');
  btnCancel.classList.add('btn-block');
  btnCancel.classList.add('my-3');
  btnCancel.textContent = 'Cancel';

  btnCancel.addEventListener('click', () => {
    modal.hidden = true;
  });

  wrapper.appendChild(heading);
  wrapper.appendChild(btnDelete);
  wrapper.appendChild(hr);
  wrapper.appendChild(btnCancel);

  modal.innerHTML = '';
  modal.appendChild(wrapper);

  modal.hidden = false;
}
