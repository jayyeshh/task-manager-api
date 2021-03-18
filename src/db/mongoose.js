const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
});


/*

const doc=new Task({
    description: "take the red pill",
});

doc.save().then((res) => {
    console.log(res);
}).catch(err => {
    console.log("Something went wrong!", err);
});
*/