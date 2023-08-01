import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'f0c1d857be1788',
        pass: '78cc6a7fb1ffe9'
    }
})

const forgotPasswordEmail = async (email: string, token: string) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Recuperação de senha ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <b>👋 Olá, tudo bem?</b><br>
            <p>Um pedido de redefinição de senha foi emitido para a sua conta em nosso ecommerce.</p>
            <p>Seu token de verificação é: <br>
            <strong style="font-size: 40px; color: #1B98E0">${token}</strong></p>
            <p>Acesse o link abaixo para prosseguir com a redefinição de sua senha: 👇 <br>
                <a style="word-wrap: break-word;" href="www.example.com.br/redefinepassword&email=${email}" target="_blank">
                    www.example.com.br/redefinepassword&email=${email}
                </a>
            </p>
            <p><strong>Obs:</strong> Esse token é válido por 10 minutos!</p>
            <p>Caso não tenha sido você quem solicitou, pedimos que apenas ignore este email e em hipótese alguma compartilhe o seu token com terceiros.</p>
            <br>
            <p>Atenciosamente, Lázaro Fernandes Art.</p>
        </div>
        </section>
        `
    }, (err) => {
        if (err) throw new Error
    })
}

const newAdministradorPasswordEmail = async (email: string, token: string) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Administrador criado ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <b>👋 Olá, tudo bem?</b><br>
            <p>Sua conta admnistrativa, acabou de ser criada em nosso ecommerce.</p>
            <p>Seu token de acesso é: <br>
            <strong style="font-size: 40px; color: #1B98E0">${token}</strong></p>
            <p>Acesse o link abaixo, faça login e redefina sua senha: 👇 <br>
                <a style="word-wrap: break-word;" href="www.example.com.br/redefinepassword&email=${email}" target="_blank">
                    ${process.env.LOCAL_FRONTEND_ADDRESS}/admin/login&email=${email}
                </a>
            </p>
            <br>
            <p>Atenciosamente, Lázaro Fernandes Art.</p>
        </div>
        </section>
        `
    }, (err) => {
        if (err) throw new Error
    })
}

export const SendEmail = {
    forgotPasswordEmail,
    newAdministradorPasswordEmail
}


