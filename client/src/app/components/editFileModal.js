import fetchFileContent from '../api/fetchFileContent';
import updateFileContent from '../api/updateFileContent';

async function handleFormSubmit(path, name, content) {
  const result = await updateFileContent(path, name, content);
  if (!result.data) return alert(`ERRROR! ${result.message}`);
  return result.data.content;
}

async function renderEditFileModal(path, name) {
  const result = await fetchFileContent(path, name);
  if (!result.data) return alert(`ERROR! ${result.message}`);

  const modal = document.getElementById('edit-file');
  const textarea = document.createElement('textarea');
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
      value="${name}"
      readonly
    />  
  `;

  textarea.classList.add('form-control');
  textarea.setAttribute('rows', 11);
  textarea.value = result.data.content;

  const btnSubmit = document.createElement('button');
  btnSubmit.classList.add('btn', 'btn-primary', 'btn-sm', 'btn-block', 'mt-3');
  btnSubmit.textContent = 'Save';

  form.appendChild(inputGroup);
  form.appendChild(textarea);
  form.appendChild(btnSubmit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = form.querySelector('textarea').value;
    await handleFormSubmit(path, name, content);
    modal.hidden = true;
  });

  const hr = document.createElement('hr');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-block', 'mt-3');
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

  return result.data;
}

export default renderEditFileModal;
