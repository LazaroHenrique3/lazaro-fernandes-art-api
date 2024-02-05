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

const newSaleNotification = async (email: string, idSale: number) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Pedido confirmado ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <p>
                Cód. Pedido: <strong style="font-size: 40px; color: #1B98E0">#${idSale}</strong>
            </p>
            <br>
            <b>👋 Olá, tudo bem?</b><br>
            <p>🎉 Pedido confirmado com sucesso!</p>
            <p>Agora, o seu item está a um passo de ser seu! Assim que o pagamento for confirmado, iniciaremos com entusiasmo a preparação do seu pedido. 🚀</p>
            <br>
            <p>Atenciosamente, Lázaro Fernandes Art.</p>
        </div>
        </section>
        `
    }, (err) => {
        if (err) throw new Error
    })
}

const saleInPreparationNotification = async (email: string, idSale: number) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Preparando pedido ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <p>
                Cód. Pedido: <strong style="font-size: 40px; color: #1B98E0">#${idSale}</strong>
            </p>
            <br>
            <b>👋 Olá, tudo bem?</b><br>
            <p>🎉 Estamos preparando o seu pedido!</p>
            <p> Estamos preparando com carinho o seu pedido, garantindo que cada detalhe seja perfeito. Em breve, você estará desfrutando do que escolheu. 🌟</p>
            <br>
            <p>Atenciosamente, Lázaro Fernandes Art.</p>
        </div>
        </section>
        `
    }, (err) => {
        if (err) throw new Error
    })
}

const saleSendNotification = async (email: string, trackingCode: string, idSale: number) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Pedido enviado ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <p>
                Cód. Pedido: <strong style="font-size: 40px; color: #1B98E0">#${idSale}</strong>
            </p>
            <br>
            <b>👋 Olá, tudo bem?</b><br>
            <p>🎉 Seu pedido foi enviado!</p>
            <p>🚀 Boas notícias! Seu pedido foi enviado com sucesso e está a caminho do seu destino. Para acompanhar a jornada da sua(s) obra(s) de arte, utilize o código de rastreio abaixo. Mal podemos esperar para saber que chegou em suas mãos e trouxe ainda mais cor à sua vida!</p>
            <br>
            <p>🔍 Código de Rastreio: <br>
                <strong style="font-size: 40px; color: #1B98E0">${trackingCode}</strong>
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

const saleConcludeNotification = async (email: string, idSale: number) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Pedido concluído ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <p>
                Cód. Pedido: <strong style="font-size: 40px; color: #1B98E0">#${idSale}</strong>
            </p>
            <br>
            <b>👋 Olá, tudo bem?</b><br>
            <p>🎉 Verificamos que o seu pedido foi entregue com sucesso!</p>
            <p>✨🏡 Esperamos que a arte tenha trazido mais cor e alegria para o seu espaço, tornando-o verdadeiramente especial.</p>
            <br>
            <p>🎨 Agradeço por escolher minha arte para fazer parte da sua vida! Seja sempre bem-vindo(a) por aqui.</p>
            <br>
            <p>Atenciosamente, Lázaro Fernandes Art.</p>
        </div>
        </section>
        `
    }, (err) => {
        if (err) throw new Error
    })
}

const saleCancelNotification = async (email: string, idSale: number) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: 'Pedido cancelado ✔',
        // eslint-disable-next-line quotes
        html: `
        <section style="font-size: 20px; text-align: justify; display: flex; justify-content: center; align-items: center; font-family: 'Trebuchet MS', Arial, sans-serif; box-sizing: border-box;">
        <div style=" padding: 20px; width: 100%; max-width: 500px; min-width: 300px; border-top: 60px solid black; border-bottom: 40px solid black; background: #E9F7FF; box-sizing: border-box;">
            <p>
                Cód. Pedido: <strong style="font-size: 40px; color: #1B98E0">#${idSale}</strong>
            </p>
            <br>
            <b>👋 Olá, tudo bem?</b><br>
            <p>😢 Seu pedido foi cancelado!</p>
            <p>🎨 Caso haja algum motivo específico para o cancelamento, estamos aqui para ajudar no que for necessário. Se, em algum momento no futuro, decidir revisitar a ideia de adquirir uma peça de arte exclusiva, ficaremos felizes em recebê-lo(a) novamente.</p>
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
        subject: 'Novo pedido ✔',
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
    newAdministradorPasswordEmail,
    newSaleNotification,
    saleInPreparationNotification,
    saleSendNotification,
    saleConcludeNotification,
    saleCancelNotification
}


