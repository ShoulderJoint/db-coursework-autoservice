const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendPasswordEmail = async (toEmail, login, plainPassword) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_LOGIN ,
            to: toEmail,
            subject: 'Доступ к системе управления СТО',
            text: `Здравствуйте!

Ваш аккаунт в системе успешно создан.
Для входа используйте следующие данные:
Логин: ${login}
Временный пароль: ${plainPassword}

При первом входе система попросит вас установить новый постоянный пароль.

С уважением,
Администрация СТО`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено: ', info.messageId);
        return true;
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        return false;
    }
};

module.exports = { sendPasswordEmail };