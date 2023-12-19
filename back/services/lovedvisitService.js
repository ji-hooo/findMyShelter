const { lovedVisitModel } =require('../db/index.js');

class lovedvisitService{
    //service for adding new document when there is no duplicate
    static async addlovedvisit({ user_id, shelter_id,name,address,shelter_type }){
        //checking if there is duplicates of shelter

        const logged_shelter = await lovedVisitModel.findonedocument({user_id,shelter_id});
        if (logged_shelter){
            const errorMessage="이 쉼터는 이미 추가가 되었습니다. 다른 쉼터를 추가해주세요";
            return { errorMessage };
        }

        const newlovedvisit={ user_id, shelter_id,name,address,shelter_type}
        
        const createdlovedshelter=await lovedVisitModel.create(newlovedvisit);
        
        createdlovedshelter.errorMessage=null;
        return createdlovedshelter;
    }

// I'm pretty sure that you don't need to use name,address,shelter_type for finding document that i intend to get or delete

    
    //service for getting all documents of user
    static async getusersvisits({user_id}) {
        const visits = await lovedVisitModel.findusersvisits({user_id});
        if(!visits){
            const errorMessage="no frequently visited shelters";
            return {errorMessage};
        }
        return visits;
    }

    //service for getting one document of user
    static async getusersvisit({user_id,shelter_id}){
        const logged_shelter = await lovedVisitModel.findonedocument({user_id,shelter_id});
        if(!logged_shelter){
            const errorMessage="no such document";
            return {errorMessage}
        }
        return logged_shelter;
    }


   

    //service for deleting one visit of user
    static async deleteusersvisit({user_id,shelter_id}){
        const deletedvisit= await lovedVisitModel.deleteonedocument({user_id,shelter_id});
        if(!deletedvisit){
            const errorMessage="no document deleted";
            return {errorMessage};
        }

        return deletedvisit;
    }

    //service for deleting all visits of user
    static async deleteusersvisits({user_id}){
        const deletedvisits= await lovedVisitModel.deleteAllusersvisits({user_id});
        if(!deletedvisits){
            const errorMessage="no documents deleted";
            return {errorMessage};
        }
        return deletedvisits;
    
    }
    

}

export {lovedvisitService};