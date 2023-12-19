import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { lovedvisitService } from "../services/lovedvisitService";



// i can modify to return requested shelter datas as well using sheltermodel or shelterservice


const lovedVisitRouter=Router();


//user_id information is crucial so that it's not supposed to be visible.-> make sure to take it with req.body

//inserting new data to lovedVisit collection
// data sent from request is in req.body
lovedVisitRouter.post("/bookmark",
login_required,
async function (req,res, next){

    try {
        if (!req.body) {
          throw new Error(
            "headers의 Content-Type을 application/json으로 설정해주세요"
          );
        }

        // getting user_id and shelter_id from req.body
        const { user_id, shelter_id,name,address,shelter_type } = req.body;  
        
        const newvisit = await lovedvisitService.addlovedvisit({ user_id, shelter_id,name,address,shelter_type });

        if(newvisit.errorMessage){
            throw new Error(newvisit.errorMessage);
        }
        res.status(201).json(newvisit);

    }catch(error){
        next(error);
    }
});


// i should get information from shelter table...
lovedVisitRouter.get("/bookmark/user_id",
login_required,
async function(req,res,next){
    try{
        //req.body is user_id
        const {user_id}=req.body;
        const visits =await lovedvisitService.getusersvisits({user_id});

        if(visits.errorMessage){
            throw new Error(visits.errorMessage);
        }

        //return data in json format
        res.status(200).json(visits);

    }catch(error){
        next(error);
    }
});

lovedVisitRouter.get("/bookmark/user_id/:shelter_id",
login_required,
async function(req,res,next){
    try{
        //req.body is user_id
        const {user_id}=req.body; // { } for destructuring
        const shelter_id=req.params.shelter_id;
        const visit =await lovedvisitService.getusersvisit({user_id,shelter_id});

        if(visit.errorMessage){
            throw new Error(visit.errorMessage);
        }

       res.status(200).json(visit);

    }catch(error){
        next(error);
    }
});

//deleting one lovedvisit document
lovedVisitRouter.delete("/bookmark/user_id/:shelter_id",
login_required,
async function(req,res,next){
    try{
        //req.body is user_id
        const {user_id}=req.body;
        const shelter_id=req.params.shelter_id;
        const deletedvisit = await lovedvisitService.deleteusersvisit({user_id,shelter_id});
        if(deletedvisit.errorMessage){
            throw new Error(visits.errorMessage);
        }

        res.status(200).json(deletedvisit);

    }catch(error){
        next(error);
    }
})

//deleting all lovedvisitsdocuments from one user
lovedVisitRouter.delete("/bookmark/user_id",
login_required,
async function(req,res,next){
    try{
        //req.body is user_id
        const {user_id}=req.body;
        const deletedvisits = await lovedvisitService.deleteusersvisits({user_id});
        if(deletedvisits.errorMessage){
            throw new Error(visits.errorMessage);
        }

        
        res.status(200).json(deletedvisits);

    }catch(error){
        next(error);
    }
})

export { lovedVisitRouter };