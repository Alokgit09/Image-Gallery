const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://aalokyadav:12345@cluster0.xg88yai.mongodb.net/image-gallery?retryWrites=true&w=majority",
    {
        //   useCreateIndex:true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => {
        console.log("connection successful");
    })
    .catch((error) => {
        console.log("somthing wrong", error);
    });