// 추후에 계정정보 DB처리
var accounts = new Array();

accounts.push({privateKey : "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe", address : "0xec58179D7BD7CBEd4D1a76376A1c961C61548071", password : "1234"})
accounts.push({privateKey : "0x6c437e944ae018dfd5fb4db44b7c6a7e4e6450067ff3a9f2418a2b33878ab0c3", address : "0x46dFB25D41FE98f6e32Fbf61424EE8B5Dc91a02a", password : "1234"})

module.exports.set_accounts = function (name, address, password) {
    accounts.push({name : name, address : address, password : password})
}

module.exports.get_accounts = function () {
    return accounts;
}

// 0xec58179D7BD7CBEd4D1a76376A1c961C61548071정보
// { version: 3,
//     id: '1cf82130-0ec7-43b5-88fd-cea8cd7753ef',
//     address: 'ec58179d7bd7cbed4d1a76376a1c961c61548071',
//     crypto:
//     { ciphertext:
//         '864b1676cb31b4232b96e2fb2bba31068415ece21c781370ea4146b71b9d031a',
//             cipherparams: { iv: 'cac53e16be12e41f7a912a7ef66078a2' },
//         cipher: 'aes-128-ctr',
//             kdf: 'scrypt',
//         kdfparams:
//         { dklen: 32,
//             salt:
//             'eba9a26abd13762b5c3ef1c3fd5269fd37b6c95ee7026d99f387e5390c6dee9f',
//                 n: 8192,
//             r: 8,
//             p: 1 },
//         mac:
//             '0910242ffff082112ca1a0c1ec61c1e27ec5716a9d4b64ce173c7c42f6ae4da0' } }

// 0x46dFB25D41FE98f6e32Fbf61424EE8B5Dc91a02a정보
// { version: 3,
//     id: '9e818467-8c1a-43b3-bfd4-f596c9a84427',
//     address: '46dfb25d41fe98f6e32fbf61424ee8b5dc91a02a',
//     crypto:
//     { ciphertext:
//         'eb4a6360fed27c9496ce776973ad4a05648fa37a924e8347087308e494fe0fd0',
//             cipherparams: { iv: '097214fd572943cd7732b0029c9a55b7' },
//         cipher: 'aes-128-ctr',
//             kdf: 'scrypt',
//         kdfparams:
//         { dklen: 32,
//             salt:
//             '1b87f3a18a87711a652860e68a04ab099374219e0fd891ca9f64720110582e41',
//                 n: 8192,
//             r: 8,
//             p: 1 },
//         mac:
//             '225f365890cf13aec5cc233af4e1dc0ec58d6df533c2133848caf4315810a0f3' } }
