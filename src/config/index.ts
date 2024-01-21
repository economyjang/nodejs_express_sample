export default {
    development: {
        type: 'mysql' as const,
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'rsdroot@0705',
        database: 'nodejs_express',
    },
    test: {
        type: "sqlite" as const,
        database: ":memory:",
        dropSchema: true
    }
};
