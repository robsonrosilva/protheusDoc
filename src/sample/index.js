$(document).ready(function () {
  // precorre a arvore para montar o menu
  $('#tree').html(treeHtml({ name: '', files: [], paths: [dataProject.tree] }));
  $('label.tree-toggler').click(function () {

    if ($(this).parent().children('ul.tree').css("display") === "block") {
      $(this).parent().children(".icon").html(`
      <svg style="margin-right:10px;" class="bi bi-folder" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.828 4a3 3 0 01-2.12-.879l-.83-.828A1 1 0 006.173 2H2.5a1 1 0 00-1 .981L1.546 4h-1L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3v1z"/>
      <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 00-.996 1.09l.637 7a1 1 0 00.995.91h10.348a1 1 0 00.995-.91l.637-7A1 1 0 0013.81 4zM2.19 3A2 2 0 00.198 5.181l.637 7A2 2 0 002.826 14h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0013.81 3H2.19z" clip-rule="evenodd"/>
      </svg>
      `);
    }
    else {

      $(this).parent().children(".icon").html(`
      <svg style="margin-right:10px;" class="bi bi-folder-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.826a2 2 0 01-1.991-1.819l-.637-7a1.99 1.99 0 01.342-1.31L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 006.172 2H2.5a1 1 0 00-1 .981l.006.139z" clip-rule="evenodd"/>
      </svg>
      `);
    }

    $(this).parent().children('ul.tree').toggle(300);

  });
});

function treeHtml(object) {
  let html = '';
  object.paths.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
  object.files.sort((a, b) => {
    if (a.file > b.file) return 1;
    if (a.file < b.file) return -1;
    return 0;
  });

  for (let i in object.paths) {
    html += '<li> <span class="icon"> ';

    if (object.paths[i].name === 'raiz') {
      html += '<svg style="margin-right:10px;" class="bi bi-folder-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">';
      html += '  <path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.826a2 2 0 01-1.991-1.819l-.637-7a1.99 1.99 0 01.342-1.31L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 006.172 2H2.5a1 1 0 00-1 .981l.006.139z" clip-rule="evenodd" />';
      html += '</svg>';
    } else {
      html += '<svg style="margin-right:10px;" class="bi bi-folder" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">';
      html += '  <path d="M9.828 4a3 3 0 01-2.12-.879l-.83-.828A1 1 0 006.173 2H2.5a1 1 0 00-1 .981L1.546 4h-1L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3v1z" />';
      html += '  <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 00-.996 1.09l.637 7a1 1 0 00.995.91h10.348a1 1 0 00.995-.91l.637-7A1 1 0 0013.81 4zM2.19 3A2 2 0 00.198 5.181l.637 7A2 2 0 002.826 14h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0013.81 3H2.19z" clip-rule="evenodd" />';
      html += '</svg>';
    }

    html += '</span> <label class="tree-toggler nav-header"> ' + object.paths[i].name + '</label>';
    html += '<ul class="nav nav-list tree"';
    // raiz fica visível sempre
    html += object.paths[i].name === 'raiz' ? '>' : 'style="display: none;">';
    html += treeHtml(object.paths[i]);
    html += '</ul></li>';
  }

  for (let i in object.files) {
    html += `<li><a href="#" onclick="return loadIframe('file.html?file=${object.files[i].uniqueName}')">` + object.files[i].file + '</a></li>';
  }

  return html;
}

function loadIframe(url) {
  $('#conteudo').html(`<iframe frameborder="0" src="${url}">Your browser doesn't support iframes.</iframe>`);
  return false;
}
