

const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");


const app=express();

const port=4445;
const dbPath=path.join(__dirname,"covid19INDIA.db");
let db=null;

const initializeDBAndServer= async()=>{
    try {
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(port,()=>{
            console.log(`DB Conected \n Server running on ${port}`)
        })
    } catch (e) {
        console.log(`DB Error:${e.message}`);
        process.exit(1)
    }
}
initializeDBAndServer();


  
  // GETTING ALL STATES FROM STATES TABLE
  app.get("/states",async(req,res)=>{
    const getstates=`SELECT * FROM state`;
    const state=await db.all(getstates);
    res.send(state);
  });

  // GET METHOD USING ID
app.get("/states/:id", async (req, res) => {
  const { id } = req.params;
  const getstates = `
   SELECT
   *
  FROM
 state
  WHERE
  state_id = ${id};`;
  const statesArray = await db.all(getstates);
  res.send(statesArray);
 });

 // POST METHOD district 
 
app.use(express.json())
app.post("/districts",async(req,res)=>{
  const {district_id,district_name,state_id,cases,cured,active,deaths}=req.body;
  console.log(req.body)
  try {
    const addDstrict=`INSERT INTO district(district_id,district_name,state_id,cases,cured,active,deaths)
    VALUES(
   ${district_id},
   ' ${district_name}',
   ${state_id},
    ${cases},
    ${cured},
    ${active},
    ${deaths});`;
        const district=await db.run(addDstrict);
        res.status(200).json({message:`District  added successfully with ${district.lastID}`});
  } catch (e) {
    console.log("/districts",e.message);
    res.status(500).send("internal server error");
  }
});

// GET METHOD USING ID
app.get("/districts/:id", async (req, res) => {
  const { id } = req.params;
  const getdistrict = `
   SELECT
   *
  FROM
 district
  WHERE
  district_id = ${id};`;
  const districtArray = await db.all(getdistrict);
  res.send(districtArray);
 });

   // DELETE METHOD
        
   app.delete("/districts/:id", async (req, res) => {
    const { id } = req.params;
     const deletedistrict = `
     DELETE FROM
     district
    WHERE
     district_id = ${id};`;
     await db.run(deletedistrict);
     res.send("District Deleted Successfully");
    });


     
//  PUT METHOD
app.use(express.json())
app.put("/districts/:id",async(req,res)=>{
    const { id } = req.params;
  const {district_id,district_name,state_id,cases,cured,active,deaths}=req.body;
  console.log(req.body)
  try {
    const addDistrict=`UPDATE district
     SET
     district_name= '${district_name}'
     WHERE 
     district_id=${id};`;
        const district=await db.run(addDistrict);
        res.status(200).json({message:`District updated successfully with ${district.lastID}`});
  } catch (e) {
    console.log("/districts",e.message);
    res.status(500).send("internal server error");
  }
});

// -- GET METHOD FOR COUNT
app.get( "/states/:stateId/stats",
  async (req, res) => {
    const { stateId } = req.params;
    const getStateStatsQuery = `
    SELECT
      SUM(cases),
      SUM(cured),
      SUM(active),
      SUM(deaths)
    FROM
      district
    WHERE
      state_id=${stateId};`;
    const stats = await db.get(getStateStatsQuery);
    res.send({
      totalCases: stats["SUM(cases)"],
      totalCured: stats["SUM(cured)"],
      totalActive: stats["SUM(active)"],
      totalDeaths: stats["SUM(deaths)"],
     
    });
  }
);
module.exports=app;
 


