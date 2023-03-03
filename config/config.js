const config = {
    local: {
        DB: {
            HOST: "localhost",
            PORT: "27017",
            DATABASE: "CCG",
            // DATABASE1: "AuthDB",
            UserName: "",
            Password: "",
            UserName1: "",
            Password1: "",
        },

        EMAIL: {
            host: "smtp.gmail.com",
            user: "ccgservicesoz@gmail.com",
            password: "abbzjmmqpcnjxrzf",
            // api_key: "c89d3026957c30426647bf29fb1d9739-787e6567-2c7f8802",
            // domain: "sandbox9988bd48331f43679a9b038e8ecd3420.mailgun.org"
          },
        // DB: {
        // HOST: "54.201.160.69",
        // PORT: "58173",
        // DATABASE: "Cadence4",
        // DATABASE1: "Cadence2",
        // UserName: "Cadence4",
        // Password: "tryhn34rCv",
        // UserName1: "Cadence2",
        // Password1: "sdcvbxAS23",
        // },
        PORTS: {
            API_PORT: 4002,
            API_HOST:"localhost:4200"
        },

        SECRETKEY: "CCGDevelopment2023",
        // EMAIL: {
        //     host: "smtp.gmail.com",
        //     user: "cadencehealthcareservice@gmail.com",
        //     password: "weweksogsdlrkhlq",
        // },
        // cryptoSecret: "Cadence@08$08#2022",
        // secret: {
        //     jwt: "Cadencetestaccount"
        // },
        // ENCRYPTION: {
        //     algorithm: "aes-256-cbc",
        //     iv: "Cadence@08$08#2022"
        // }
    }
}

module.exports.get = function get(env) {
    return config[env];
};