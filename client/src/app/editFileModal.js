async function handleSubmitButton(
  currentPath,
  item,
  fileContent,
  closeModal,
  callback,
) {
  const requestOptions = {
    method: 'PUT',
    redirect: 'follow',
  };

  const url = `http://localhost:4000/api/file?path=${currentPath}&filename=${item.name}&content=${fileContent}`;

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

async function fetchFileContent(currentPath, fileName, callback) {
  const url = `http://localhost:4000/api/file?path=${currentPath}&filename=${fileName}`;

  try {
    const raw = await fetch(url);
    const res = await raw.json();

    if (res.error) callback(res.error, null);
    else callback(null, res.data);
  } catch (error) {
    console.log(error);
    alert('Something went wrong!', error.message);
  }
}

export default function renderEditFileModal(item, currentPath, callback) {
  const textarea = document.createElement('textarea');

  fetchFileContent(currentPath, item.name, (err, data) => {
    if (err) {
      alert(`Sorry! Something went wrong! ${err}`);
      return;
    }

    textarea.value = data;
  });

  const modal = document.getElementById('edit-file');

  const wrapper = document.createElement('div');

  const form = document.createElement('form');

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');
  inputGroup.classList.add('mb-3');
  inputGroup.innerHTML = `
    <div class="input-group-prepend">
      <span class="input-group-text">File name</span>
    </div>
    <input
      type="text"
      class="form-control text-center"
      value="${item.name}"
      readonly
    />  
  `;

  textarea.classList.add('form-control');
  textarea.setAttribute('rows', 11);

  const btnSubmit = document.createElement('button');
  btnSubmit.classList.add('btn');
  btnSubmit.classList.add('btn-primary');
  btnSubmit.classList.add('btn-sm');
  btnSubmit.classList.add('btn-block');
  btnSubmit.classList.add('mt-3');
  btnSubmit.textContent = 'Save';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileContent = form.querySelector('textarea').value;

    handleSubmitButton(
      currentPath,
      item,
      fileContent,
      function closeModal() {
        modal.hidden = true;
      },
      callback,
    );
  });

  form.appendChild(inputGroup);
  form.appendChild(textarea);
  form.appendChild(btnSubmit);

  const hr = document.createElement('hr');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('btn');
  btnCancel.classList.add('btn-danger');
  btnCancel.classList.add('btn-sm');
  btnCancel.classList.add('btn-block');
  btnCancel.classList.add('mt-3');
  btnCancel.textContent = 'Cancel';

  btnCancel.addEventListener('click', () => {
    modal.hidden = true;
  });

  wrapper.appendChild(form);
  wrapper.appendChild(hr);
  wrapper.appendChild(btnCancel);

  modal.innerHTML = '';
  modal.appendChild(wrapper);

  modal.hidden = false;
}
