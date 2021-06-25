$(document).ready(function () {
  // precorre a arvore para montar o menu
  let file = getUrlParameter('file');
  let fileData = dataProject.files.find((x) => {
    return x.fileName === file;
  });
  if (fileData) {
    $('#fonte').html('Fonte: ' + fileData.fileName);
    if (fileData.description) {
      $('#description').html(fileData.description);
    }
    let content = '';
    let htmlModel = $('#content')[0].outerHTML.replace('id="content"', '');
    for (let key = 0; key < fileData.functionList.length; key++) {
      content += functionHtml(fileData.functionList[key], htmlModel);
    }
    $('#content').html(content);

    if ($('#' + getUrlParameter('anchor')).offset()) {
      $('html, body').animate(
        {
          scrollTop: $('#' + getUrlParameter('anchor')).offset().top,
        },
        500
      );
    }
  }

  // Botão Go Top
  var btn = $('#btnToTop');

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
  });

});

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
}

function functionHtml(functionObject, functionHtml) {
  let fixedProperties = [
    'functionName',
    'description',
    'author',
    'since',
    'version',
    'param',
    'return',
    'example',
    'link',
    'type',
    'see',
  ];

  let nameSplit = functionObject.functionName.split('::');
  if (functionObject.functionName.search('::') && nameSplit.length > 1) {
    functionHtml = functionHtml.replace(
      /\%functionName\%/g,
      nameSplit[1] + ` <small> of Class ${nameSplit[0]} </small>`
    );
  } else {
    functionHtml = functionHtml.replace(
      /\%functionName\%/g,
      functionObject.functionName
    );
  }

  functionHtml = functionHtml.replace(
    '%functionAnchor%',
    functionObject.functionName.replace(new RegExp(":", 'g'), "_")
  );

  functionHtml = functionHtml.replace(
    '%description%',
    functionObject.description
  );

  functionHtml = functionHtml.replace(
    '%type%',
    functionObject.type ? functionObject.type : ''
  );
  functionHtml = functionHtml.replace(
    '%author%',
    functionObject.author ? functionObject.author : ''
  );
  functionHtml = functionHtml.replace(
    '%since%',
    functionObject.since ? functionObject.since : ''
  );
  functionHtml = functionHtml.replace(
    '%version%',
    functionObject.version ? functionObject.version : ''
  );

  let sintaxe = functionObject.functionName.replace('::', '():') + '(';
  let param = '';

  if (functionObject.param.length > 0) {
    param += '<h4>Parâmetros</h4>';
    param +=
      '<table class="table table-striped table-bordered table-condensed table-sm">';
    param += '<thead> <tr>';
    param += '    <th>Nome</th>';
    param += '    <th>Tipo</th>';
    param += "    <th>Uso</th>";
    param += '    <th>Descrição</th>';
    param += '  </tr> </thead> <tbody>';
    // param += "  </thead> <tbody>";

    for (let i = 0; i < functionObject.param.length; i++) {
      sintaxe += functionObject.param[i].name;
      sintaxe += i == functionObject.param.length - 1 ? '' : ',';

      param += '<tr><td>' + functionObject.param[i].name + '</td>';
      param += '<td>' + functionObject.param[i].type + '</td>';
      param += '<td>' + (functionObject.param[i].obrigatory ? "Obrigatório" : "Opcional") + '</td>';
      param += '<td>' + functionObject.param[i].description + '</td></tr>';
    }

    param += '</tbody></table>';
  }

  sintaxe += ')';

  functionHtml = functionHtml.replace('%sintaxe%', sintaxe);
  functionHtml = functionHtml.replace('%param%', param);

  let history = '';

  if (functionObject.history.length > 0) {
    history += '<h4>Histórico</h4>';
    history +=
      '<table class="table table-striped table-bordered table-condensed table-sm">';
    history += '<thead> <tr>';
    history += '    <th>Nome</th>';
    history += '    <th>Data</th>';
    history += '    <th>Descrição</th>';
    history += '  </tr> </thead> <tbody>';

    for (let i = 0; i < functionObject.history.length; i++) {
      history += '<tr><td>' + functionObject.history[i].username + '</td>';
      history += '<td>' + functionObject.history[i].date + '</td>';
      history += '<td>' + functionObject.history[i].description + '</td></tr>';
    }

    history += '</tbody></table>';
  }

  functionHtml = functionHtml.replace('%history%', history);

  let returnHtml = '';

  if (functionObject.return.length > 0) {
    returnHtml += '<h4>Retorno</h4>';
    returnHtml +=
      '<table class="table table-striped table-bordered table-condensed table-sm">';
    returnHtml += '<thead> <tr>';
    returnHtml += '      <th>Tipo</th>';
    returnHtml += '      <th>Descrição</th>';
    returnHtml += '    </tr>';
    returnHtml += '  </tr> </thead> <tbody>';

    for (let i = 0; i < functionObject.return.length; i++) {
      returnHtml += '<tr><td>' + functionObject.return[i].type + '</td>';
      returnHtml +=
        '<td>' + functionObject.return[i].description + '</td></tr>';
    }

    returnHtml += '</tbody></table>';
  }

  functionHtml = functionHtml.replace('%return%', returnHtml);

  let example = functionObject.example.length ? '<h4>Exemplo</h4>' : '';
  for (let i = 0; i < functionObject.example.length; i++) {
    example += (i > 0 ? '<br>' : '') + '<code>' + functionObject.example[i] + '</code>';
  }
  functionHtml = functionHtml.replace('%example%', example);

  let see = '';
  for (let i = 0; i < functionObject.link.length; i++) {
    see += (see ? '<br>' : '') +
      '<a href="' +
      functionObject.link[i] +
      '" target="_blank">' +
      functionObject.link[i] +
      '</a>';
  }

  functionObject.see.forEach((_see) => {
    see += (see ? '<br>' : '') + _see;
  })

  functionHtml = functionHtml.replace('%link%', see);

  let otherInfo = '';
  for (var prop in functionObject) {
    if (
      Object.keys(functionObject).includes(prop) &&
      !fixedProperties.includes(prop)
    ) {
      if (functionObject[prop] && typeof functionObject[prop] === 'string') {
        otherInfo += '<tr><td>' + prop + '</td>';
        otherInfo += '<td>' + functionObject[prop] + '</td></tr>';
      } else if (
        functionObject[prop] &&
        Object.prototype.toString.call(functionObject[prop]) ===
        '[object Array]') {
        functionObject[prop].forEach(item => {
          otherInfo += '<tr><td>' + prop + '</td>';
          otherInfo += '<td>' + item + '</td></tr>';
        })
      }
    }
  }
  if (otherInfo.length) {
    otherInfo = '<h4>Outras Informações</h4><table>' + otherInfo + '</table>';
  }

  functionHtml = functionHtml.replace('%otherInfo%', otherInfo);

  return functionHtml;
}