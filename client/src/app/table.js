/* eslint-disable */

import shortenString from './utils/shortenString';
import attachFileIcon from './utils/attachFileIcon';

export default function renderTable(elementID, source) {
  const tableRoot = document.getElementById(elementID);
  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('table-striped');
  table.classList.add('table-hover');

  let heading = `
    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>Date Modified</th>
        <th>Type</th>
        <th>Size</th>
      </tr>
    </thead>
  `;

  let html = source.map((s) => {
    return `
      <tr>
        <td>
          <span>${
            s.isFolder
              ? '<i class="fas fa-folder"></i>'
              : `<i class="${attachFileIcon(s.extension)}"></i>`
          }</span>
          <span>${shortenString(s.name)}</span>
        </td>
        <td>
          ${new Date(s.modifiedAt).toLocaleDateString()} 
          at
          ${new Date(s.modifiedAt).toLocaleTimeString()}
        </td>
        <td>${s.isFolder ? 'Folder' : 'File'}</td>
        <td>${s.size ? s.size + ' B' : ''}</td>
      </tr>
    `;
  });

  html = html.join('');
  html = `<tbody>${html}</tbody>`;
  html = heading + html;

  if (source.length === 0) html = 'Folder is empty!';

  table.innerHTML = html;

  tableRoot.innerHTML = '';
  tableRoot.appendChild(table);
}
