export const environment = {
  production: false,
  uri: `mongodb://${this.database.host}:${this.database.password}@${
    this.database.instance
  }.${this.database.location}:${this.database.port}/?${
    this.database.certificate
  }`,
  database: {
    host: 'eowynreconsideredb',
    password: '271Eq088',
    instance: 'docdb-2019-01-15-22-36-15',
    location: 'cqnawh2jjso4.us-east-2.docdb.amazonaws.com',
    port: '27017',
    certificate: 'ssl_ca_certs=rds-combined-ca-bundle.pem'
  }
};
