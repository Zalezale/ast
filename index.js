const fs = require('fs')
const esprima = require('esprima')//生成抽象语法树
const estraverse = require('estraverse')//遍历ast


//只接受字符串

function analyzeCode(code) { 
    var ast = esprima.parse(code);  
    var functionsStats = {}; //1  
  
    var addStatsEntry = function (funcName) { //2  
        if (!functionsStats[funcName]) {  
            functionsStats[funcName] = { calls: 0, declarations: 0 };  
        }  
    };  
  
    // 3  
    estraverse.traverse(ast, {  
        enter: function (node) {  
            if (node.type === 'FunctionDeclaration') {  
                addStatsEntry(node.id.name); //4  
                functionsStats[node.id.name].declarations++;  
            } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {  
                addStatsEntry(node.callee.name);  
                functionsStats[node.callee.name].calls++; //5  
            }  
        }  
    });  
    processResults(functionsStats)
}  
function processResults(results) {  
    for (var name in results) {  
        if (results.hasOwnProperty(name)) {  
            var stats = results[name];  
            if (stats.declarations === 0) {  
                console.log('Function', name, 'undeclared');  
            } else if (stats.declarations > 1) {  
                console.log('Function', name, 'decalred multiple times');  
            } else if (stats.calls === 0) {  
                console.log('Function', name, 'declared but not called');  
            }  
        }  
    }  
}   

if (process.argv.length < 3) {  
    console.log('Usage: index.js file.js');  
    process.exit(1);  
}  
  
// 3  
var filename = process.argv[2];  
console.log('Reading ' + filename);  
var code = fs.readFileSync('./'+filename,'utf8');  
analyzeCode(code);  
console.log('Done');  