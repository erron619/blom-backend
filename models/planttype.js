const mongoose = require("mongoose");
const log      = require("debug")("model:user");

const NAME_LENGTH = 24;

const model = mongoose.model("planttype", new mongoose.Schema({
    engname: { 
        type: String,
        required: true, 
        maxlength: NAME_LENGTH 
    },
    faname: { 
        type: String, 
        required: true, 
        maxlength: NAME_LENGTH 
    },
    description: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    image: {

    }
}));

async function createTest() {
    const data = [
        {
            engname: "Zamioculcas zamiifolia",
            faname: "زاموفیلیا",
            description: `این گیاه بسیار به خشکی مقاوم هست و اگه یادتون بره که بهش آب بدین گیاه از بین نمیره ولی نباید زیاد در شرایط خشکی نگهش دارید. نور مورد نیاز این گیاه روزانه حداقل ۶ الی ۸  ساعت هست. آبیاری هم بهتره که زمانی انجام بشه که خاک به عمق ٣ الی ٤ سانتی متری خشک باشه. در اصل این گیاه رو به عنوان گیاه آهنی معرفی میکنند و برای افراد مبتدی بهترین گزینه هست و قاتل اصلی اون آبیاری زیاد هست.`,
        },
        {
            engname: "Epipremnum aureum",
            faname: "پتوس",
            description: `پتوس هم جز گیاهان آپارتمانی مقاومی هست که نسبت خشکی از خودش مقاومت نشون میده به همین دلیل نباید زیاد بهش آب بدین. اصلا نباید این گیاه رو درمقابل نور مستقیم خورشید قرار بدین و دمای مورد نیاز این گیاه ۱۸ تا ۲۴ درجه باید باشه ولی نکته ی مهم و قابل توجه اینه که این گیاه مقاوم به خشکی هست و نباید زیاد آبیاری بشه.`,
        },
        {
            engname: "Dracaena trifasciata",
            faname: "سانسوریا",
            description: `از دیگر گزینه های برای گیاهان مقاوم آپارتمانی به خشکی میشه به سانسوریا اشاره کرد که اگر یک هفته یادتون بره بشه آب بدید هیچ مشکلی براش پیش نمیاد و تا مدتها فقط با چروک شدن برگ از کم آبی شکایت میکنه، در ضمن به نور کم هم مقاوم هست و میتونه در شرایط کم نوری هم رشد خوبی داشته باشه`,
        },
        {
            engname: "Peperomia",
            faname: "گل قاشقی",
            description: `یکی دیگه از گیاهان آپارتمانی مقاوم به کم نوری گل قاشقی هست. نیاز دمایی این گیاه حداکثر در تابستان ۲۴ درجه و حداقل درجه در زمستان ۱۸ درجه است. حتما به آبیاری این گیاه هم دقت کنید و اجازه بدین در بین دو آبیاری سطح خاک گلدان خشک بشه چون آبیاری بیش از اندازه به خصوص توی فصول سرد باعث ایجاد بیماری قارچی توی گیاه میشه.`,
        },
    ]
    await model.deleteMany({});
    data.forEach(async item => {
        await new model({
            engname: item.engname,
            faname: item.faname,
            description: item.description,
        }).save();
    });
}

async function get_all() {
    return await model.find().select({ engname: 1, faname: 1, description: 1 });
}

module.exports = {
    model,
    createTest,
    get_all,
}