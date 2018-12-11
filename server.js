'use strict'
const app = require('./src/persistence/organizations.mongoose');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`Api inicializada com sucesso na porta ${port}`);
});
