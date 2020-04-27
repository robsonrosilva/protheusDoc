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
  }
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
  ];
  functionHtml = functionHtml.replace(
    /\%functionName\%/g,
    functionObject.functionName
  );
  functionHtml = functionHtml.replace(
    '%description%',
    functionObject.description
  );
  functionHtml = functionHtml.replace('%author%', functionObject.author);
  functionHtml = functionHtml.replace('%since%', functionObject.since);
  functionHtml = functionHtml.replace('%version%', functionObject.version);

  let sintaxe = functionObject.functionName + '(';
  let param = '';

  param += "<table>";
  param += "  <tr>";
  param += "    <th>Nome</th>";
  param += "    <th>Tipo</th>";
  param += "    <th>Uso</th>";
  param += "    <th>Descrição</th>";
  param += "  </tr>";

  for (let i = 0; i < functionObject.param.length; i++) {
    sintaxe += functionObject.param[i].name;
    sintaxe += i == functionObject.param.length - 1 ? '' : ',';

    param += '<tr><td>' + functionObject.param[i].name + '</td>';
    param += '<td>' + functionObject.param[i].type + '</td>';
    param += '<td>' + functionObject.param[i].obrigatory + '</td>';
    param += '<td>' + functionObject.param[i].description + '</td></tr>';
  }

  param += "</table>";

  sintaxe += ')';

  functionHtml = functionHtml.replace('%sintaxe%', sintaxe);
  functionHtml = functionHtml.replace('%param%', param);

  let returnHtml = '';
  returnHtml += "<table>";
  returnHtml += "    <tr>";
  returnHtml += "      <th>Tipo</th>";
  returnHtml += "      <th>Descrição</th>";
  returnHtml += "    </tr>";

  for (let i = 0; i < functionObject.return.length; i++) {
    returnHtml += '<tr><td>' + functionObject.return[i].type + '</td>';
    returnHtml += '<td>' + functionObject.return[i].description + '</td></tr>';
  }

  returnHtml += "  </table>";

  functionHtml = functionHtml.replace('%return%', returnHtml);

  let example = '';
  for (let i = 0; i < functionObject.example.length; i++) {
    example += '<code>' + functionObject.example[i] + '</code>';
  }
  functionHtml = functionHtml.replace('%example%', example);

  let link = '';
  for (let i = 0; i < functionObject.link.length; i++) {
    link +=
      '<a href="' +
      functionObject.link[i] +
      '" target="_blank">' +
      functionObject.link[i] +
      '</a>';
  }
  functionHtml = functionHtml.replace('%link%', link);

  let otherInfo = '';
  for (var prop in functionObject) {
    if (
      Object.keys(functionObject).includes(prop) &&
      !fixedProperties.includes(prop) &&
      typeof functionObject[prop] === 'string'
    ) {
      if (functionObject[prop]) {
        otherInfo += '<tr><td>' + prop + '</td>';
        otherInfo += '<td>' + functionObject[prop] + '</td></tr>';
      }
    }
  }
  functionHtml = functionHtml.replace('%otherInfo%', otherInfo);

  return functionHtml;
}
