async function handleFormSubmit(
  currentPath,
  fileName,
  fileContent,
  closeModal,
  callback,
) {
  const requestOptions = {
    method: 'POST',
    redirect: 'follow',
  };

  const url = `http://localhost:4000/api/file?path=${currentPath}&filename=${fileName}&content=${fileContent}`;

  try {
    const raw = await fetch(url, requestOptions);
    const res = await raw.json();

    console.log(res);

    if (!res.data) callback(res.error, null);
    else callback(null, res.data);
  } catch (error) {
    console.log('error', error);
    callback(error.message, null);
  } finally {
    closeModal();
  }
}

export default function renderNewFileModal(currentPath, callback) {
  const modal = document.getElementById('new-file');
  const form = document.createElement('form');
  const formGroup = document.createElement('div');
  formGroup.classList.add('form-group');

  formGroup.innerHTML = `
    <input
      type="text"
      id="file-name"
      placeholder="File name with its extension"
      class="form-control"
      autocomplete="off"
    />

    <small class="text-muted d-block mt-3">Put some content or leave it alone!</small>
    <textarea
      id="file-content"
      class="form-control"
      rows="7"
    >
    </textarea>

    <input
      type="submit"
      value="Create"
      class="btn btn-primary btn-block mt-3 mb-5"
    />
  `;

  form.appendChild(formGroup);
  form.appendChild(document.createElement('hr'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newFileName = form.querySelector('input').value;
    const fileContent = form.querySelector('textarea').value;

    if (newFileName.trim().length === 0) {
      alert('Invalid file name!');
      return;
    }

    handleFormSubmit(
      currentPath,
      newFileName,
      fileContent,
      function closeModal() {
        modal.hidden = true;
      },
      callback,
    );
  });

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('btn');
  closeBtn.classList.add('btn-danger');
  closeBtn.classList.add('btn-block');
  closeBtn.classList.add('mt-1');
  closeBtn.textContent = 'Close';

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  const wrapper = document.createElement('div');
  wrapper.appendChild(form);
  wrapper.appendChild(closeBtn);

  modal.innerHTML = '';
  modal.appendChild(wrapper);

  modal.hidden = false;
}
