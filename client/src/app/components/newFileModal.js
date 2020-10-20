const renderNewFileModal = (onFormSubmit) => {
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
    ></textarea>

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
    modal.hidden = true;

    const newFileName = form.querySelector('input').value;
    const fileContent = form.querySelector('textarea').value;

    onFormSubmit(newFileName, fileContent);
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
};

export default renderNewFileModal;
