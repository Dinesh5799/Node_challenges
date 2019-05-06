require("../db/Mongo/db");
const Contacts = require("../db/Model/contact");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/contact/:query',(req,res)=>{
    try{
        let par = req.params.query.toUpperCase();
        Contacts.find({}).then(resp=>{
            if(!isNEU(resp) && resp.length > 0){
                let res_hold = [];                     
                for(let i=0;i<resp.length;i++){                    
                    if(resp[i]["number"].toString().indexOf(par) !== -1 || resp[i]["email"].toUpperCase().indexOf(par) !== -1 || 
                    resp[i]["name"].toUpperCase().indexOf(par) !== -1){
                        res_hold.push(resp[i]);
                    }
                }
                if(res_hold.length > 0){
                    res.json({"no_of_records":res_hold.length, "records":res_hold});
                }else{
                    res.status(404).json({'errMsg':'No matching Contact details found!'});
                }
            }else{
                res.status(404).json({'errMsg':'No Contact details found!'});
            }
        }).catch(err=>{
            res.status(500).json({'errMsg':'Internal server error: '+err});
        });
    }catch(e){
        res.status(500).json({'errMsg':'Internal server error.'});
    }
});
app.post('/contact',(req,res)=>{
    try{
        const {name,email,number} = req.body;
        Contacts.find({number}).then(resp=>{
            console.log(resp);
            if(resp && resp.length > 0){
                res.status(409).json({'errMsg':'Phone number already saved.'});
            }else{
                if(!isNEU(name) && !isNEU(email) && !isNEU(number)){
                    let contact = new Contacts(req.body);
                    contact.save().then(response=>{
                        res.json("Successfully added the contact.");
                    }).catch(err=>{
                        res.status(500).json(err);
                    });
                }                
            }
        }).catch(error=>{
            res.status(500).json(error);
        })
    }catch(e){
        res.status(500).json({'errMsg':'Internal server error.'});
    }
});
app.put('/contact',(req,res)=>{
    try{
        const {name,email,number,_id} = req.body;
        Contacts.find({_id}).then(resp=>{            
            if(resp && resp.length > 0){
                if(!isNEU(name) && !isNEU(email) && !isNEU(number)){ 
                    console.log("Updating");                   
                    Contacts.updateOne({_id},{$set:{name,number,email}},{upsert:true}).then(resp=>{
                        console.log(resp);
                        res.json("Successfully updated the contact.");
                    }).catch(err=>{
                        res.status(500).json({'errMsg':'Internal server error: '+err});
                    })                                       
                } 
            }else{
                res.status(404).json({'errMsg':'Contact details not found!'});               
            }
        }).catch(error=>{
            res.status(500).json({'errMsg':'Internal server error: '+error});
        })
    }catch(e){
        res.status(500).json({'errMsg':'Internal server error.'});
    }
});
app.delete('/contact/:number',(req,res)=>{
    let number = req.params;
    if(!isNEU(number)){
        Contacts.find({number}).then(resp=>{
            if(resp && resp.length > 0){
                Contacts.deleteOne({number}).then(response=>{
                    res.json("Successfully deleted the contact.");
                }).catch(err=>{
                    res.status(500).json({'errMsg':'Internal server error: '+err});
                });
            }else{
                res.status(404).json({'errMsg':'Contact details not found!'})               
            }
        });
    }
});
app.get("*",(req,res)=>{
    res.status(404).json({"errMsg":"Page not found!"});
});
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}.`);
});

function isNEU(param){
    return !(param !== null && param !== "null" && param != "Null" && param !== undefined && typeof(param) !== 'undefined' && param !== "" && param !== " ");
}