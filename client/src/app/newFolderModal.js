async function handleFormSubmit(currentPath, folderName, closeModal, callback) {
  const requestOptions = {
    method: 'POST',
    redirect: 'follow',
  };

  const url = `http://localhost:4000/api/directory?path=${currentPath}&name=${folderName}`;

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

export default function renderNewFolderModal(currentPath, callback) {
  const modal = document.getElementById('new-folder');
  const form = document.createElement('form');
  const formGroup = document.createElement('div');
  formGroup.classList.add('form-group');

  formGroup.innerHTML = `
    <input
      type="text"
      id="folder-name"
      placeholder="Folder name"
      class="form-control"
      autocomplete="off"
    />

    <input
      type="submit"
      value="Create"
      class="btn btn-primary btn-block mt-3 mb-5"
    />
  `;

  form.appendChild(formGroup);
  form.appendChild(document.createElement('hr'));

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('btn');
  closeBtn.classList.add('btn-danger');
  closeBtn.classList.add('btn-block');
  closeBtn.classList.add('mt-1');
  closeBtn.textContent = 'Close';

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newFolderName = form.querySelector('input').value;
    if (newFolderName.trim().length === 0) {
      alert('Invalid folder name!');
      return;
    }

    handleFormSubmit(
      currentPath,
      newFolderName,
      function closeModal() {
        modal.hidden = true;
      },
      callback,
    );
  });

  const wrapper = document.createElement('div');
  wrapper.appendChild(form);
  wrapper.appendChild(closeBtn);

  modal.innerHTML = '';
  modal.appendChild(wrapper);

  modal.hidden = false;
}
