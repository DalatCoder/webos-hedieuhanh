/* eslint-disable */

import $ from 'jquery';

import 'jquery.fancytree/dist/skin-win8/ui.fancytree.min.css';

import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';
import renderTable from './table';

let state = [];

let path = '';

async function fetchData(url, callback) {
  try {
    const raw = await fetch(url);
    const res = await raw.json();
    const { data: directories, path } = res;
    // console.log(directories, path);
    renderTable('table', { directories, path });

    if (state.length === 0) state = directories;

    render();
    if (callback) callback(directories);
  } catch (err) {
    console.log(err);
    alert(`Something went wrong: ${err}`);
  }
}

function render() {
  $(function () {
    $('#tree').fancytree({
      checkbox: false,
      source: state,
      activate: function (event, data) {
        const { name, path, id } = data.node.data;

        for (const dir of state) {
          const currentDir = findDirectoryWithID(dir, id);
          if (currentDir) {
            // console.log(currentDir);
            if (!currentDir['expanded']) {
              currentDir['expanded'] = true;
            } else {
              currentDir['expanded'] = !currentDir['expanded'];
            }
            break;
          }
        }

        // console.log(state);
        render();

        let newPath = `${path}/${name}`;
        // console.log(newPath);
        // console.log(id);

        fetchData(
          `http://localhost:4000/api/directory?path=${newPath}`,
          (directories) => {
            for (const dir of state) {
              const currentDir = findDirectoryWithID(dir, id);
              if (currentDir) {
                // console.log(currentDir);
                currentDir.children = directories;
                break;
              }
            }

            render();
          },
        );
      },
    });
  });
}

function findDirectoryWithID(directory, id) {
  // console.log(directory.name, directory.id, id);
  if (directory.id === id) {
    return directory;
  }

  if (!directory.children) {
    return null;
  }

  for (var dir of directory.children) {
    const find = findDirectoryWithID(dir, id);
    if (find) return find;
  }
}

fetchData('http://localhost:4000/api/directory?path=/mnt/c');
