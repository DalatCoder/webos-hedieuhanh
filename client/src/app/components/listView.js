import attachFileIcon from '../utils/attachFileIcon';
import shortenString from '../utils/shortenString';
import attachItemName from '../utils/attachItemName';
import convertSize from '../utils/convertSize';

function renderEmpty() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div>
      <h1 class="text-primary">Thư mục trống</h1>
      <p class="lead">Nhấn chuột phải để tạo mới tập tin hoặc thư mục</p>
    </div>
  `;

  const style = `
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;    
    text-align: center;
    border-top: 1px solid pink;
  `;

  wrapper.setAttribute('style', style);

  return wrapper;
}

function renderListView(
  directories,
  onItemClick,
  onItemDoubleClick,
  onContextMenuOpen,
) {
  const listView = document.getElementById('table');
  listView.innerHTML = '';

  if (directories.length === 0) {
    // Empty directory
    listView.classList.add('empty');
    listView.appendChild(renderEmpty());
    return;
  }

  const table = document.createElement('table');
  table.classList.add('table', 'table-hover', 'table-sm', 'table-borderless');

  const thead = document.createElement('thead');
  thead.classList.add('thead-pink');
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Date Modified</th>
      <th>Type</th>
      <th>Size</th>
    </tr>  
  `;

  const tbody = document.createElement('tbody');

  for (let i = 0; i < directories.length; i += 1) {
    const dir = directories[i];

    const tr = document.createElement('tr');
    if (dir.selected) {
      tr.classList.add('selected');
    }

    const [time, date] = dir.modifiedAt.split(', ');

    const html = `
        <td title="${dir.name}">
          <span>${
            dir.isFolder
              ? '<i class="fas fa-folder"></i>'
              : `<i class="${attachFileIcon(dir.extension)}"></i>`
          }</span>
          <span>${shortenString(dir.name)}</span>
        </td>
        <td>${date} at ${time}</td>
        <td title="${
          dir.isFolder
            ? 'File folder'
            : `${shortenString(attachItemName(dir.extension))}`
        }">${
      dir.isFolder ? 'File folder' : `${attachItemName(dir.extension)}`
    }</td>
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
