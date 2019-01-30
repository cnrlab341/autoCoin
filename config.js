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

        //===== test =====//
        {file:'./test', path:'/echo', method:'echo', type:'get'}
        //===== User =====//
        // {file:'./user', path:'/process/login', method:'login', type:'post'}					    // user.login
        // ,{file:'./user', path:'/process/adduser', method:'adduser', type:'post'}				// user.adduser
        // ,{file:'./user', path:'/process/listuser', method:'listuser', type:'post'}		    	// user.listuser

    ]
}