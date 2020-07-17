let protheusDoc = require('../lib/protheusDoc');
let objeto = new protheusDoc.ProtheusDocHTML();

objeto
	.ProjectInspect(
		['D:/GDRIVE/Trabalho/WORKSPACE/POUPEX/ADVPL/protheus'],
		'./test/out/project'
	)
	.catch((e) => {
		console.log(e);
	});

objeto
	.FilesInspect(
		[
			'D:/GDRIVE/Trabalho/WORKSPACE/lord/LORD/Fiscal/Rotinas/ffisa001.prw',
		],
		'./test/out/unique file'
	)
	.catch((e) => {
		console.log(e);
	});
