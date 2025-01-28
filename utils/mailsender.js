const nodemailer=require("nodemailer")
const maileSender=async(email,title,body)=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.USER_MAIL,
            auth:{
                user:process.env.MAIL_USER,
                PASS:process.env.MAIL_PASS,
            }
        })

        let info=await transporter.sendMail({
            from:'Notion | codehelp'
            ,to:`${email}`
            ,subject:`${title}`
            ,html:`${body}`
        })
        console.log(info)
        return info;
    } catch (error) {
        console.log("some error while sending the mail",error.message)
    }
}