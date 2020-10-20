function renderNewFolderModal(onFormSubmit) {
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.hidden = true;
    const newFolderName = form.querySelector('input').value;
    onFormSubmit(newFolderName);
  });

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('btn', 'btn-danger', 'btn-block', 'mt-1');
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

export default renderNewFolderModal;
