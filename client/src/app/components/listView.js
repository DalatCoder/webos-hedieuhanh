import attachFileIcon from '../utils/attachFileIcon';
import shortenString from '../utils/shortenString';
import convertSize from '../utils/convertSize';

function renderListView(
  directories,
  currentPath,
  parentPath,
  onItemClick,
  onItemDoubleClick,
  onContextMenuOpen,
  onBackClick,
) {
  const listView = document.getElementById('table');
  listView.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('table', 'table-striped', 'table-hover', 'table-sm');

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

  const tbody = document.createElement('tbody');

  // Back folder
  if (currentPath !== '/') {
    const trBack = document.createElement('tr');
    trBack.innerHTML = `
        <td title="Go back to parent directory"><span><i class="fas fa-folder"></i></span> ..Go back</td>
        <td></td>
        <td></td>
        <td></td>  
  `;
    trBack.addEventListener('click', () => {
      onBackClick(parentPath);
    });
    tbody.appendChild(trBack);
  }

  for (let i = 0; i < directories.length; i += 1) {
    const dir = directories[i];

    const tr = document.createElement('tr');
    if (dir.selected) {
      tr.classList.add('selected');
    }

    const [time, date] = dir.modifiedAt.split(', ');

    const html = `
        <td title=${dir.name}>
          <span>${
            dir.isFolder
              ? '<i class="fas fa-folder"></i>'
              : `<i class="${attachFileIcon(dir.extension)}"></i>`
          }</span>
          <span>${shortenString(dir.name)}</span>
        </td>
        <td>${date} at ${time}</td>
        <td>${dir.isFolder ? 'Folder' : 'File'}</td>
        <td>${
          Number.isInteger(dir.size)
            ? convertSize(Number.parseInt(dir.size, 10))
            : ''
        }</td>
    `;

    tr.innerHTML = html;

    tr.addEventListener('click', () => {
      onItemClick(dir);
    });

    tr.addEventListener('dblclick', () => {
      onItemDoubleClick(dir);
    });

    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  listView.appendChild(table);
  listView.addEventListener('contextmenu', () => {
    onContextMenuOpen();
  });
}

export default renderListView;
