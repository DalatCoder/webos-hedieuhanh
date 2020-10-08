/* eslint-disable */

import shortenString from './utils/shortenString';
import attachFileIcon from './utils/attachFileIcon';

let state = {
  selectedItem: {},
  directories: [],
};

export default function renderTable(elementID, source) {
  const tableRoot = document.getElementById(elementID);

  // Clear UI
  tableRoot.innerHTML = '';

  if (!source || source.length === 0) {
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.classList.add('text-primary');
    div.classList.add('display-4');
    div.textContent = 'Folder is empty';

    tableRoot.append(div);
    return;
  }

  state.directories = source;

  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('table-striped');
  table.classList.add('table-hover');
  table.classList.add('table-sm');

  const thead = document.createElement('thead');
  thead.classList.add('thead-dark');
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Date Modified</th>
      <th>Type</th>
      <th>Size</th>
    </tr>  
  `;

  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (const dir of state.directories) {
    const tr = document.createElement('tr');
    if (dir.selected) {
      tr.classList.add('selected');
    }

    const html = `
        <td title=${dir.name}>
          <span>${
            dir.isFolder
              ? '<i class="fas fa-folder"></i>'
              : `<i class="${attachFileIcon(dir.extension)}"></i>`
          }</span>
          <span>${shortenString(dir.name)}</span>
        </td>
        <td>
          ${new Date(dir.modifiedAt).toLocaleDateString()} 
          at
          ${new Date(dir.modifiedAt).toLocaleTimeString()}
        </td>
        <td>${dir.isFolder ? 'Folder' : 'File'}</td>
        <td>${dir.size ? dir.size + ' B' : ''}</td>
    `;

    tr.innerHTML = html;

    tr.addEventListener('click', () => {
      handleTableRowClick(dir);
    });

    tr.addEventListener('dblclick', () => {
      handleTableRowDoubleClick(dir);
    });

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  tableRoot.appendChild(table);
}

function handleTableRowClick(item) {
  state.selectedItem = item;

  for (const dir of state.directories) {
    if (dir.id === item.id) dir.selected = !dir.selected;
    else dir.selected = false;
  }

  renderTable('table', state.directories);
}

async function handleTableRowDoubleClick(item) {
  const newPath = `${item.path}/${item.name}`;
  let url = 'http://localhost:4000/api';

  if (item.isFolder) {
    url = `${url}/directory?path=${newPath}`;
  } else {
    const arr = item.name.split('.');
    const ext = arr[arr.length - 1];
    if (ext !== 'txt') {
      alert('File does not support to view or edit!');
      return;
    }

    url = `${url}/file?path=${item.path}&filename=${item.name}`;
  }

  const raw = await fetch(url);
  const res = await raw.json();
  const { data: directories } = res;

  renderTable('table', directories);
}
