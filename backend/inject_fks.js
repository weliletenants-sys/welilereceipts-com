const fs = require('fs');

const fkCsvRaw = fs.readFileSync('../foreign_key.csv', 'utf8');
const fkLines = fkCsvRaw.split('\n').filter(Boolean).slice(1);

const schemaRaw = fs.readFileSync('../prisma/schema.prisma', 'utf8');
const models = schemaRaw.split('model ');

const toPascal = s => {
    if (!s) return s;
    return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
};

const existingModels = new Set();
for (let i = 1; i < models.length; i++) {
    const lines = models[i].split('\n');
    for(let j = 0; j < lines.length; j++) {
        if(lines[j].includes('@@map("')) {
            const match = lines[j].match(/@@map\("([^"]+)"\)/);
            if (match) existingModels.add(match[1]);
            break;
        }
    }
}

// Parse relationships from CSV
const relations = {};
for (const line of fkLines) {
    const parts = line.trim().split(';');
    if(parts.length < 3) continue;
    const col = parts[0];
    const refTable = parts[1];
    const sourceTable = parts[2];
    
    // Only process relations if both sides of the relationship actually exist in our Prisma schema!
    if (!col || !refTable || !sourceTable) continue;
    if (!existingModels.has(refTable) || !existingModels.has(sourceTable)) continue;

    if (!relations[sourceTable]) relations[sourceTable] = [];
    relations[sourceTable].push({ col, refTable });
}

let out = [models[0]]; // Retain generator config

for (let i = 1; i < models.length; i++) {
    const m = models[i];
    const lines = m.split('\n');
    
    // Find table mapped name
    let tName = null;
    let insertIdx = -1;
    for(let j = 0; j < lines.length; j++) {
        if(lines[j].includes('@@map("')) {
            const match = lines[j].match(/@@map\("([^"]+)"\)/);
            if (match) {
                tName = match[1];
                insertIdx = j;
            }
            break;
        }
    }

    if (tName && relations[tName]) {
        for (const rel of relations[tName]) {
            const refModel = toPascal(rel.refTable);
            let relName = rel.col.replace('_id', '');
            
            // Check if the underlying scalar field exists in the model lines
            let fieldExists = false;
            for(let l of lines) {
                if (l.trim().startsWith(rel.col + ' ')) {
                    fieldExists = true;
                    break;
                }
            }

            // If the raw field doesn't exist, we must add it first as a String? to support the relation
            if (!fieldExists) {
                lines.splice(insertIdx, 0, `  ${rel.col} String?`);
                insertIdx++; // moved @@map down
            }

            // Standardize relationship syntax
            lines.splice(insertIdx, 0, `  ${relName}_rel ${refModel}? @relation("${tName}_${rel.col}", fields: [${rel.col}], references: [id], onDelete: NoAction, onUpdate: NoAction)`);
            insertIdx++;
        }
    }
    
    out.push('model ' + lines.join('\n'));
}

// Second pass to add symmetric reverse relationships
const completeSchema = out.join('');
let finalModels = completeSchema.split('model ');
let finalOut = [finalModels[0]];

const reverseRelations = {};
for (const sourceTable in relations) {
    for (const rel of relations[sourceTable]) {
        if (!reverseRelations[rel.refTable]) reverseRelations[rel.refTable] = [];
        reverseRelations[rel.refTable].push({ sourceTable, col: rel.col });
    }
}

for (let i = 1; i < finalModels.length; i++) {
    const m = finalModels[i];
    const lines = m.split('\n');
    
    let tName = null;
    let insertIdx = -1;
    for(let j = 0; j < lines.length; j++) {
        if(lines[j].includes('@@map("')) {
            const match = lines[j].match(/@@map\("([^"]+)"\)/);
            if (match) {
                tName = match[1];
                insertIdx = j;
            }
            break;
        }
    }

    if (tName && reverseRelations[tName]) {
        for (const rev of reverseRelations[tName]) {
            const sourceModel = toPascal(rev.sourceTable);
            lines.splice(insertIdx, 0, `  ${rev.sourceTable}_${rev.col} ${sourceModel}[] @relation("${rev.sourceTable}_${rev.col}")`);
        }
    }
    
    finalOut.push('model ' + lines.join('\n'));
}

fs.writeFileSync('../prisma/schema_with_fks.prisma', finalOut.join(''));
console.log('Successfully generated schema_with_fks.prisma stripping missing tables');
