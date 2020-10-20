const renderDeleteModal = (item, onSubmit) => {
  const modal = document.getElementById('delete-item');

  const wrapper = document.createElement('div');

  const heading = document.createElement('p');
  heading.classList.add('text-danger', 'lead', 'mb-3', 'text-center');

  heading.textContent = `Delete ${item.isFolder ? 'folder' : 'file'} "${
    item.name
  }"?`;

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn', 'btn-danger', 'btn-block', 'mb-5');
  btnDelete.textContent = 'Delete';

  btnDelete.addEventListener('click', () => {
    modal.hidden = true;
    onSubmit(item);
  });

  const hr = document.createElement('hr');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('btn', 'btn-info', 'btn-block', 'my-3');
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
};

export default renderDeleteModal;
