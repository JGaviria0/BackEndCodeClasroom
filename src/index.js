
const express = require('express')
const bodyParser = require('body-parser')
const { createClient } = require('@libsql/client')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = createClient({
    url: "libsql://test-db-jgaviria0.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3MTI5NjY1ODUsImlhdCI6MTcxMjM2ODMxOSwiaWQiOiJhYTc0MTg5ZS1kMzNiLTExZWUtYWE5NS1kZTY4ZDJiZDkwODkifQ.Sdhgx9DW_0i7nPqBVIcpUusa74_Z5eP7DAqK9Or4jpalPFOxZ1Wr_ekttSZpJ3LSVnyGAfmG0tFtau_nrd5yDQ",
  });


app.set('port', process.env.PORT || 3000); 

app.get('/', (req, res) => {
    res.json(
        {
            "Title": "API works"
        }
    );
});

app.get('/users', async (req, res) => {
    const result = await db.execute("SELECT * FROM contacts;");
    res.json(result.rows);
});

app.post('/user', async (req, res) => {
    console.log(req.body);
    const value = await db.execute(`INSERT INTO contacts (first_name, last_name, email, phone) VALUES ('${req.body.name}', '${req.body.lastname}', '${req.body.email}', '${req.body.phone}');`);
    res.json({ "message": value.lastInsertRowid });
}); 

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const value = await db.execute(`DELETE FROM contacts WHERE contact_id = ${id};`);
    res.json({ "message": "User deleted" });
});

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
