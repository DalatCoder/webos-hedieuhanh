/* eslint-disable */

import PATH from 'path';

import $ from 'jquery';

import 'jquery.fancytree/dist/skin-lion/ui.fancytree.min.css';

import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';

import fetchDirectory from '../api/fetchDirectory';
import editFileModal from '../components/editFileModal';

function renderTreeView(items, onItemClick) {
  $(function () {
    $('#tree').fancytree({
      checkbox: false,
      source: items,
      activate: async function (event, data) {
        const { path, name, isFile, attributes } = data.node.data;

        if (isFile) {
          if (attributes.editable) editFileModal(path, name);
          else alert('File do not support to view or edit!');
          return;
        }

        const response = await fetchDirectory(PATH.join(path, name));
        if (!response.data) return alert(`ERROR! ${response.message}`);

        const subDirectories = response.data.items;

        data.node.removeChildren();
        data.node.addChildren(subDirectories);
        data.node.setExpanded(true);

        onItemClick(
          subDirectories,
          response.data.currentPath,
          response.data.parentPath,
        );
      },
    });
  });
}

export default renderTreeView;
