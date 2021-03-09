import bodyParser from "body-parser";
import express from 'express';
const app = express();
import file from 'file-system';
import moment from 'moment';
import cors from 'cors'

app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
const jsonParser = bodyParser.json();

const routes = express.Router();
app.use("/", jsonParser, routes);

app.get("/", (req, res, next) => {
    const message = "Welcome to survey backend example";
    res.json({ message });
});

app.get("/survey", (req, res) => {
    file.readFile("surveydata.json", async function (err, data) {

    
        if (data) {
            res.status(200).send({
                survey: JSON.parse(data),
                message: "Survey found"
            });
        }
        else {
            res.status(404).send({
                survey: {},
                message: "No survey found"
            });
        }
    })
    
})

app.put("/survey", (req, res) => {
    const currentDateAndTime = moment().format("DD-MM-YYYY-HH-MM-ss");

    file.writeFileSync(`surveyAnswers_${currentDateAndTime}`, JSON.stringify(req.body))
    console.log("Survey saved, check file with timestamp.")
    res.status(200).send({msg: "Saving done!"});
})

export default app;