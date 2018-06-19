
// --------  --------

// Enter new shopping lists
// View all current shopping lists
// Delete any shopping list
// View the grocery items in a particular shopping list
// add items to a particular shopping list
// delete grocery items off a list
// view the count of all grocery items
// add registration, login, allowing user to persist information based on their credentials

// -------- Loading Dependencies --------
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const promise = require('bluebird')
let options = {
    promiseLib : promise
}
let pgp = require('pg-promise')(options)
let connectionString= 'postgres://localhost:5432/shopping'
let db = pgp(connectionString)
//var session = require('express-session')

// app.use(session({
//   secret: 'lizard',
//   // Forces the session to be saved back to the session store, even if the session was never modified during the request.
//   resave: false,
//   // Forces a session that is 'uninitialized' to be saved to the store. A session is uninitialized when it is new, but not modified
//   saveUninitialized: false
// }))
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
app.get('/', (req, res)=>{
        db.any('SELECT * FROM shoppingLists;').then((data)=>{
          res.render('index',{'lists' : data})
        })
})
app.post('/', (req, res)=>{
    let title = req.body.title
    db.none('INSERT INTO shoppingLists(name) VALUES($1)',[title]).then(()=>{
        res.redirect('/')
    })
})

app.post('/delete', (req, res)=>{
    let listId = req.body.listId
    db.none(`DELETE FROM shoppingLists WHERE listId = ${listId}`)
})

app.post('/groceries', (req, res)=>{
    let productName = req.body.productName
    let quantity = req.body.quantity
    let price = req.body.price
    let listId = req.body.listId
    db.none('INSERT INTO groceryItems(productName, quantity, price, listId) VALUES($1, $2, $3, $4)', [productName, quantity, price, listId]). then(()=>{
        res.redirect('/')
    })
})

app.listen(3000, ()=> console.log('Listening on port 3000.'))