const fs = require('fs');
const {importSchema} = require('graphql-import');

(async function() {
  const text = await importSchema('src/generated/prisma.graphql');
  fs.writeFileSync('src/schema_prep.graphql', text);
})();
