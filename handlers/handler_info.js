
/*
 * 핸들러 모듈 파일에 대한 정보
 *
 */

console.log('handler_info 파일 로딩됨.');

var handler_info = [
    // {file:'./echo', method:'echo'}					// echo
     {file:'./detail', method:'detail'}
    , {file:'./calState', method:'calState'}
    , {file:'./setInitialState', method:'setInitialState'}
    , {file: './last', method: 'last'}
    , {file: './storeCsvFile', method : 'storeCsvFile'}
];



module.exports = handler_info;
