import fs from 'fs'



const numSkus = 15000
const filePath = '/Users/pierlu/Desktop/skus.csv'


let skus = 'code,name,shipping_category_id'

for (let i = 0; i < numSkus; i++) skus += `\nSKU${i},Sku ${i},rNmdOFXgRK`

fs.writeFileSync(filePath, skus)