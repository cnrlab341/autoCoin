module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    jsonrpc_api_path : '/api',
    db_schemas: [
        // {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
    ],
    route_info: [
        //===== basic =====//
        {file:'./basic', path:'/', method:'index', type:'get'},

        {file:'./join', path:'/join', method:'join', type:'get'},
        {file:'./join', path:'/join/add', method:'add', type:'post'},

        {file:'./register', path:'/register', method:'register', type:'get'},
        {file:'./register', path:'/register/blockchain', method:'blockchain', type:'post'},

        {file:'./search', path:'/search', method:'search', type:'get'},
        {file:'./search', path:'/search/buy', method:'buy', type:'post'},

        //===== test =====//
        {file:'./test', path:'/test', method:'test', type:'get'},
        {file:'./test', path:'/test/request', method:'request', type:'post'},
        {file:'./test2', path:'/test2', method:'test2', type:'get'},

        {file:'./mypage', path:'/mypage', method:'mypage', type:'get'},
        {file:'./mypage', path:'/mypage/completeChannel', method:'completeChannel', type:'post'},
        {file:'./mypage', path:'/mypage/decryptionContent', method:'decryptionContent', type:'post'}
        //===== User =====//
        // {file:'./user', path:'/process/login', method:'login', type:'post'}					    // user.login
        // ,{file:'./user', path:'/process/adduser', method:'adduser', type:'post'}				// user.adduser
        // ,{file:'./user', path:'/process/listuser', method:'listuser', type:'post'}		    	// user.listuser

    ]
}