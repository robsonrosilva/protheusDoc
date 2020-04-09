$(document).ready(function () {
  // precorre a arvore para montar o menu
  $('#tree').html(treeHtml({ name: '', files: [], paths: [dataProject.tree] }));
  $('label.tree-toggler').click(function () {
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
    html +=
      '<li><label class="tree-toggler nav-header">' + object.paths[i].name;
    html += '</label><ul class="nav nav-list tree"';
    // raiz fica visível sempre
    html += object.paths[i].name === 'raiz' ? '>' : 'style="display: none;">';
    html += treeHtml(object.paths[i]);
    html += '</ul></li>';
  }

  for (let i in object.files) {
    html +=
      `<li><a href="#" onclick="return loadIframe('file.html?file=${object.files[i].uniqueName}')">` +
      object.files[i].file +
      '</a></li>';
  }

  return html;
}

function loadIframe(url) {
  $('#conteudo').html(`
		<iframe frameborder="0" src="${url}">
            Your browser doesn't support iframes.
		</iframe>
		`);
  return false;
}
