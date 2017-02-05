'use strict';

Parse.Cloud.beforeSave("User", function(request, response){
   console.log("Before Save called");
   if ( request.object.updatedAt.getTime() === request.object.createdAt.getTime()) {
    console.log("request &response dates equal");
       var Zseq = Parse.Object.extend("ZSeqMember");
       var query = new Parse.Query(Zseq);
       query.find({
                success: function (objects) {
                    var seq = objects[0];
                    seq.increment("seq_no");
                    seq .save(null,
                        {
                            success: function (objSeq) {
                                console.log("In User Object Post Save");
                                reqeust.object.set("member_id",objSeq.get("seq_no"))
                            },
                            error: function (object, error) { return Parse.Promise.error(error); }
                        }
                    );
                }, error: function (object, error) {
                    console.log(error);
                    return Parse.Promise.error(error);
                }
            },{ useMasterKey: true });
   }
});
/*Parse.Cloud.afterSave("User", function (request) {
    console.log("Afer save called");
    if ( request.object.updatedAt.getTime() != request.object.createdAt.getTime())
    {
        console.log("hmm... nope");
        return;
    }
});*/