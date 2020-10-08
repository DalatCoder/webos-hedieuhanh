async function handleSubmitButton(
  currentPath,
  item,
  newItemName,
  closeModal,
  callback,
) {
  const requestOptions = {
    method: 'PUT',
    redirect: 'follow',
  };

  let url = 'http://localhost:4000/api';

  if (item.isFolder) {
    url = `${url}/directory?path=${currentPath}&oldname=${item.name}&newname=${newItemName}`;
  } else {
    url = `${url}/file/rename?path=${currentPath}&oldname=${item.name}&newname=${newItemName}`;
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

export default function renderRenameModal(item, currentPath, callback) {
  const modal = document.getElementById('rename-item');

  const wrapper = document.createElement('div');

  const currentNameEl = document.createElement('div');
  currentNameEl.classList.add('input-group');
  currentNameEl.classList.add('mb-3');
  currentNameEl.innerHTML = `
    <div class="input-group-prepend">
      <span class="input-group-text">Current</span>
    </div>
    <input type="text" class="form-control" value="${item.name}" readonly />  
  `;

  const newNameEl = document.createElement('div');
  newNameEl.classList.add('input-group');
  newNameEl.classList.add('mb-3');
  newNameEl.innerHTML = `
    <div class="input-group-prepend">
      <span class="input-group-text">New</span>
    </div>
    <input
      type="text"
      id="new-name"
      class="form-control"
      autocomplete="off"
      placeholder="New ${item.isFolder ? 'folder' : 'file'} name"
    />
  `;

  const btnSubmit = document.createElement('button');
  btnSubmit.classList.add('btn');
  btnSubmit.classList.add('btn-primary');
  btnSubmit.classList.add('btn-block');
  btnSubmit.classList.add('mt-5');
  btnSubmit.textContent = 'Save';

  btnSubmit.addEventListener('click', () => {
    const newName = modal.querySelector('input#new-name').value;
    if (newName.trim().length === 0) {
      alert('Invalid name!');
      return;
    }

    handleSubmitButton(
      currentPath,
      item,
      newName,
      function closeModal() {
        modal.hidden = true;
      },
      callback,
    );
  });

  const hr = document.createElement('hr');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('btn');
  btnCancel.classList.add('btn-danger');
  btnCancel.classList.add('btn-block');
  btnCancel.textContent = 'Cancel';

  btnCancel.addEventListener('click', () => {
    modal.hidden = true;
  });

  wrapper.appendChild(currentNameEl);
  wrapper.appendChild(newNameEl);
  wrapper.appendChild(btnSubmit);
  wrapper.appendChild(hr);
  wrapper.appendChild(btnCancel);

  modal.innerHTML = '';
  modal.appendChild(wrapper);

  modal.hidden = false;
}
