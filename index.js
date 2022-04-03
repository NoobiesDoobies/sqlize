const Sql = require('sequelize');
const express = require('express')
const path = require("path")
const myDB = new Sql({
    dialect: 'sqlite',
    storage: './data.db'
})
// Model
const Product = myDB.define(
  'Product', 
  {
    id: {
      type: Sql.DataTypes.INTEGER,
      field: 'id',
      autoIncrement: true,
      primaryKey: true
    },
    productName: {
      type: Sql.DataTypes.STRING,
      field: 'product_name'
    },
    sku: {
      type: Sql.DataTypes.STRING,
      field: 'sku'
    },
  },
  {
    tableName: 'products',
    timestamps: false
  }
)

const Sales = myDB.define(
  'Sales',
  {
    id: {
      type: Sql.DataTypes.INTEGER,
      field: 'id',
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      type: Sql.DataTypes.INTEGER,
      field: 'product_id'
    },
    quantity: {
      type: Sql.DataTypes.INTEGER,
      field: 'quantity'
    },
  },
  {
    tableName: 'sales',
  }
)

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = 3000

async function indexPage(req, res) {
  let products = await Product.findAll();
  res.send(`
<html>
  <head>
    <title>App Kasir</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  </head>
  <body>
    <div class="box">
      <h1>Products</h1>
      <table class="table is-fullwidth">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>SKU</th>
        </thead>
        <tbody>
          ${products.map(product => `<tr>
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${product.sku}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </body>
</html>
  `)
}

app.get('/', indexPage)

app.get("/input", (req, res)=>{

  res.sendFile(path.join(__dirname+"/test.html"))
})
app.post("/input", async (req, res)=>{
  console.log(req.body)
  await Product.create({
    productName: req.body.name,
    sku: req.body.SKU
  })
  res.redirect("/input")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



